const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');
const { parsePagination } = require('../../utils/pagination');

const FACULTY_COLS = `
  fp.id, fp.user_id, fp.department_id, fp.designation, fp.qualification,
  fp.specialization, fp.experience, fp.bio, fp.publications,
  fp.research_work, fp.subjects, fp.profile_image_file_id, fp.status,
  fp.created_at, fp.updated_at,
  u.name AS teacher_name, u.email AS teacher_email,
  d.name AS department_name, d.slug AS department_slug,
  pf.file_url AS profile_image_url,
  COALESCE(pf.attachment_type, 'FILE') AS profile_image_attachment_type
`;

const FROM_CLAUSE = `
  FROM faculty_profiles fp
  INNER JOIN users u ON fp.user_id = u.id
  INNER JOIN departments d ON fp.department_id = d.id
  LEFT JOIN files pf ON fp.profile_image_file_id = pf.id
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchProfile(id) {
  const [rows] = await pool.execute(
    `SELECT ${FACULTY_COLS} ${FROM_CLAUSE} WHERE fp.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function fetchProfileByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT ${FACULTY_COLS} ${FROM_CLAUSE} WHERE fp.user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

async function validateFileId(fileId) {
  const [rows] = await pool.execute('SELECT id FROM files WHERE id = ?', [fileId]);
  return !!rows[0];
}

// ── Public ────────────────────────────────────────────────────────────────────

async function listFaculty({ page = 1, pageSize = 20, department_id } = {}) {
  const { page: p, pageSize: ps, offset } = parsePagination({ page, pageSize });
  page = p; pageSize = ps;
  const conditions = ["fp.status = 'ACTIVE'"];
  const params     = [];

  if (department_id) {
    conditions.push('fp.department_id = ?');
    params.push(parseInt(department_id));
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${FACULTY_COLS} ${FROM_CLAUSE} ${where} ORDER BY fp.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM faculty_profiles fp ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    faculty: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getProfile(id) {
  const profile = await fetchProfile(id);
  if (!profile || profile.status !== 'ACTIVE') throw httpError('Faculty profile not found', 404);
  return profile;
}

// ── Authenticated ─────────────────────────────────────────────────────────────

async function getMyProfile(actor) {
  const profile = await fetchProfileByUserId(actor.id);
  if (!profile) throw httpError('Faculty profile not found', 404);
  return profile;
}

async function createProfile(dto, actor) {
  const {
    user_id, department_id, designation, qualification, specialization,
    experience, bio, publications, research_work, subjects, profile_image_file_id,
  } = dto;

  if (!user_id)       throw httpError('user_id is required', 400);
  if (!department_id) throw httpError('department_id is required', 400);
  if (!designation || !designation.trim()) throw httpError('designation is required', 400);

  // HOD can only create profiles in their own department
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(department_id)) {
    throw httpError('HOD can only create profiles for their own department', 403);
  }

  // Target user must be an ACTIVE TEACHER
  const [userRows] = await pool.execute(
    `SELECT u.id, u.name, u.status, r.role_name AS role
     FROM users u INNER JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
    [user_id]
  );
  const targetUser = userRows[0];
  if (!targetUser)                    throw httpError('User not found', 404);
  if (targetUser.role !== 'TEACHER')  throw httpError('Faculty profile can only be created for a TEACHER user', 400);
  if (targetUser.status !== 'ACTIVE') throw httpError('Target user must be ACTIVE', 400);

  // One profile per user
  const [existingRows] = await pool.execute(
    'SELECT id FROM faculty_profiles WHERE user_id = ?',
    [user_id]
  );
  if (existingRows[0]) throw httpError('A faculty profile already exists for this user', 409);

  // Department must be active
  const [deptRows] = await pool.execute(
    "SELECT id FROM departments WHERE id = ? AND status = 'ACTIVE'",
    [department_id]
  );
  if (!deptRows[0]) throw httpError('Department not found or not active', 400);

  // File reference validation
  if (profile_image_file_id) {
    const fileValid = await validateFileId(profile_image_file_id);
    if (!fileValid) throw httpError('profile_image_file_id does not reference a valid file', 400);
  }

  const [result] = await pool.execute(
    `INSERT INTO faculty_profiles
       (user_id, department_id, designation, qualification, specialization,
        experience, bio, publications, research_work, subjects, profile_image_file_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      user_id,
      department_id,
      designation.trim(),
      qualification          || null,
      specialization         || null,
      experience             || null,
      bio                    || null,
      publications           || null,
      research_work          || null,
      subjects               || null,
      profile_image_file_id  || null,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'faculty',
    recordId: newId,
    description: `Created faculty profile for user id=${user_id} in department id=${department_id}`,
  });

  return await fetchProfile(newId);
}

async function updateProfile(id, dto, actor) {
  const profile = await fetchProfile(id);
  if (!profile) throw httpError('Faculty profile not found', 404);

  const isAdmin   = actor.role === 'CENTRAL_ADMIN';
  const isHodSame = actor.role === 'HOD' && Number(actor.department_id) === Number(profile.department_id);
  const isSelf    = actor.role === 'TEACHER' && Number(actor.id) === Number(profile.user_id);

  if (!isAdmin && !isHodSame && !isSelf) {
    throw httpError('You do not have permission to update this faculty profile', 403);
  }

  // TEACHER self cannot change structural fields
  if (isSelf && !isAdmin && !isHodSame) {
    if (dto.department_id !== undefined || dto.user_id !== undefined) {
      throw httpError('TEACHER cannot change department_id or user_id', 403);
    }
  }

  // Validate new department if changing
  if (dto.department_id !== undefined && Number(dto.department_id) !== Number(profile.department_id)) {
    const [deptRows] = await pool.execute(
      "SELECT id FROM departments WHERE id = ? AND status = 'ACTIVE'",
      [dto.department_id]
    );
    if (!deptRows[0]) throw httpError('Department not found or not active', 400);
  }

  // File reference validation
  if (dto.profile_image_file_id !== undefined && dto.profile_image_file_id) {
    const fileValid = await validateFileId(dto.profile_image_file_id);
    if (!fileValid) throw httpError('profile_image_file_id does not reference a valid file', 400);
  }

  // Resolve new values — undefined means keep current
  const newDepartmentId       = dto.department_id          !== undefined ? (dto.department_id          || profile.department_id) : profile.department_id;
  const newDesignation        = dto.designation            !== undefined ? (dto.designation?.trim()    || profile.designation)   : profile.designation;
  const newQualification      = dto.qualification          !== undefined ? (dto.qualification          || null) : profile.qualification;
  const newSpecialization     = dto.specialization         !== undefined ? (dto.specialization         || null) : profile.specialization;
  const newExperience         = dto.experience             !== undefined ? (dto.experience             || null) : profile.experience;
  const newBio                = dto.bio                    !== undefined ? (dto.bio                    || null) : profile.bio;
  const newPublications       = dto.publications           !== undefined ? (dto.publications           || null) : profile.publications;
  const newResearchWork       = dto.research_work          !== undefined ? (dto.research_work          || null) : profile.research_work;
  const newSubjects           = dto.subjects               !== undefined ? (dto.subjects               || null) : profile.subjects;
  const newProfileImageFileId = dto.profile_image_file_id !== undefined ? (dto.profile_image_file_id  || null) : profile.profile_image_file_id;

  await pool.execute(
    `UPDATE faculty_profiles
     SET department_id = ?, designation = ?, qualification = ?, specialization = ?,
         experience = ?, bio = ?, publications = ?, research_work = ?, subjects = ?,
         profile_image_file_id = ?
     WHERE id = ?`,
    [
      newDepartmentId, newDesignation, newQualification, newSpecialization,
      newExperience, newBio, newPublications, newResearchWork, newSubjects,
      newProfileImageFileId, id,
    ]
  );

  const changed = [];
  if (newDepartmentId       !== profile.department_id)          changed.push('department_id');
  if (newDesignation        !== profile.designation)            changed.push('designation');
  if (newQualification      !== profile.qualification)          changed.push('qualification');
  if (newSpecialization     !== profile.specialization)         changed.push('specialization');
  if (newExperience         !== profile.experience)             changed.push('experience');
  if (newBio                !== profile.bio)                    changed.push('bio');
  if (newPublications       !== profile.publications)           changed.push('publications');
  if (newResearchWork       !== profile.research_work)          changed.push('research_work');
  if (newSubjects           !== profile.subjects)               changed.push('subjects');
  if (newProfileImageFileId !== profile.profile_image_file_id)  changed.push('profile_image_file_id');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'faculty',
    recordId: id,
    description: changed.length
      ? `Updated faculty profile id=${id}: changed [${changed.join(', ')}]`
      : `Updated faculty profile id=${id}: no changes`,
  });

  return await fetchProfile(id);
}

async function updateMyProfile(dto, actor) {
  const profile = await fetchProfileByUserId(actor.id);
  if (!profile) throw httpError('Faculty profile not found', 404);

  if (dto.department_id !== undefined || dto.user_id !== undefined) {
    throw httpError('TEACHER cannot change department_id or user_id', 403);
  }

  return updateProfile(profile.id, dto, actor);
}

async function setStatus(id, newStatus, actor) {
  const profile = await fetchProfile(id);
  if (!profile) throw httpError('Faculty profile not found', 404);

  if (!['ACTIVE', 'INACTIVE'].includes(newStatus)) {
    throw httpError('status must be ACTIVE or INACTIVE', 400);
  }

  // HOD can only manage their own department's faculty
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(profile.department_id)) {
    throw httpError('HOD can only manage faculty from their own department', 403);
  }

  await pool.execute('UPDATE faculty_profiles SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'faculty',
    recordId: id,
    description: `Changed status of faculty profile id=${id} (${profile.teacher_name}) to ${newStatus}`,
  });

  return await fetchProfile(id);
}

async function softDelete(id, actor) {
  const profile = await fetchProfile(id);
  if (!profile) throw httpError('Faculty profile not found', 404);

  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(profile.department_id)) {
    throw httpError('HOD can only manage faculty from their own department', 403);
  }

  await pool.execute("UPDATE faculty_profiles SET status = 'INACTIVE' WHERE id = ?", [id]);

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'faculty',
    recordId: id,
    description: `Soft-deleted faculty profile id=${id} (${profile.teacher_name})`,
  });
}

module.exports = {
  listFaculty,
  getProfile,
  getMyProfile,
  createProfile,
  updateProfile,
  updateMyProfile,
  setStatus,
  softDelete,
};
