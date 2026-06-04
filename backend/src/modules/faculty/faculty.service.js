const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');
const { parsePagination } = require('../../utils/pagination');

const FACULTY_COLS = `
  fp.id, fp.user_id, fp.department_id, fp.designation, fp.qualification,
  fp.specialization, fp.experience, fp.bio, fp.publications,
  fp.research_work, fp.subjects, fp.profile_image_file_id, fp.status,
  fp.office_location, fp.phone_ext, fp.orcid_id, fp.scopus_h_index, fp.total_citations,
  fp.linkedin_url, fp.google_scholar_url, fp.personal_website,
  fp.phd_guided, fp.phd_ongoing, fp.pg_guided,
  fp.admin_roles, fp.memberships,
  fp.created_at, fp.updated_at,
  u.name AS teacher_name, u.email AS teacher_email, u.phone AS teacher_phone,
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

function parseProfileJsonFields(row) {
  if (!row) return null;
  return {
    ...row,
    admin_roles:  tryParseJson(row.admin_roles),
    memberships:  tryParseJson(row.memberships),
  };
}

function tryParseJson(val) {
  if (!val) return null;
  try { return typeof val === 'string' ? JSON.parse(val) : val; } catch { return val; }
}

async function fetchProfile(id) {
  const [rows] = await pool.execute(
    `SELECT ${FACULTY_COLS} ${FROM_CLAUSE} WHERE fp.id = ?`,
    [id]
  );
  return parseProfileJsonFields(rows[0] || null);
}

async function fetchProfileByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT ${FACULTY_COLS} ${FROM_CLAUSE} WHERE fp.user_id = ?`,
    [userId]
  );
  return parseProfileJsonFields(rows[0] || null);
}

async function validateFileId(fileId) {
  const [rows] = await pool.execute('SELECT id FROM files WHERE id = ?', [fileId]);
  return !!rows[0];
}

// ── Public ────────────────────────────────────────────────────────────────────

async function listFaculty({ page = 1, pageSize = 20, department_id, department_slug } = {}) {
  const { page: p, pageSize: ps, offset } = parsePagination({ page, pageSize });
  page = p; pageSize = ps;
  const conditions = ["fp.status = 'ACTIVE'"];
  const params     = [];

  // Resolve slug → numeric id so COUNT query (which has no JOIN) also works
  if (!department_id && department_slug) {
    const [deptRows] = await pool.execute(
      'SELECT id FROM departments WHERE slug = ? LIMIT 1',
      [department_slug]
    );
    if (deptRows[0]) department_id = deptRows[0].id;
  }

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
  if (profile) return profile;

  // No faculty_profiles row yet — return a shell so the teacher can fill it in.
  const [uRows] = await pool.execute(
    'SELECT id, name, email, phone, department_id FROM users WHERE id = ?',
    [actor.id]
  );
  const u = uRows[0];
  if (!u) throw httpError('User not found', 404);

  const [dRows] = await pool.execute('SELECT name FROM departments WHERE id = ?', [u.department_id]);
  return {
    id:                       null,
    user_id:                  u.id,
    department_id:            u.department_id,
    department_name:          dRows[0]?.name || '',
    teacher_name:             u.name,
    teacher_email:            u.email,
    teacher_phone:            u.phone || '',
    designation:              '',
    qualification:            null,
    specialization:           null,
    experience:               null,
    bio:                      null,
    publications:             null,
    research_work:            null,
    subjects:                 null,
    profile_image_file_id:    null,
    profile_image_url:        null,
    office_location:          null,
    phone_ext:                null,
    orcid_id:                 null,
    scopus_h_index:           null,
    total_citations:          null,
    linkedin_url:             null,
    google_scholar_url:       null,
    personal_website:         null,
    phd_guided:               0,
    phd_ongoing:              0,
    pg_guided:                0,
    admin_roles:              null,
    memberships:              null,
    status:                   'INACTIVE',
    created_at:               null,
    updated_at:               null,
  };
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
  const n = (key, fallback) => dto[key] !== undefined ? (dto[key] ?? null) : fallback;
  const ns = (key, fallback) => dto[key] !== undefined ? (dto[key]?.trim() || fallback) : fallback;
  const nj = (key, fallback) => dto[key] !== undefined ? (dto[key] ? JSON.stringify(dto[key]) : null) : fallback;

  const newDepartmentId       = dto.department_id          !== undefined ? (dto.department_id || profile.department_id) : profile.department_id;
  const newDesignation        = ns('designation', profile.designation);
  const newQualification      = n('qualification',      profile.qualification);
  const newSpecialization     = n('specialization',     profile.specialization);
  const newExperience         = n('experience',         profile.experience);
  const newBio                = n('bio',                profile.bio);
  const newPublications       = n('publications',       profile.publications);
  const newResearchWork       = n('research_work',      profile.research_work);
  const newSubjects           = n('subjects',           profile.subjects);
  const newProfileImageFileId = n('profile_image_file_id', profile.profile_image_file_id);
  const newOfficeLocation     = n('office_location',    profile.office_location);
  const newPhoneExt           = n('phone_ext',          profile.phone_ext);
  const newOrcidId            = n('orcid_id',           profile.orcid_id);
  const newScopusHIndex       = n('scopus_h_index',     profile.scopus_h_index);
  const newTotalCitations     = n('total_citations',    profile.total_citations);
  const newLinkedinUrl        = n('linkedin_url',       profile.linkedin_url);
  const newGoogleScholarUrl   = n('google_scholar_url', profile.google_scholar_url);
  const newPersonalWebsite    = n('personal_website',   profile.personal_website);
  const newPhdGuided          = dto.phd_guided   !== undefined ? (parseInt(dto.phd_guided)   || 0) : profile.phd_guided;
  const newPhdOngoing         = dto.phd_ongoing  !== undefined ? (parseInt(dto.phd_ongoing)  || 0) : profile.phd_ongoing;
  const newPgGuided           = dto.pg_guided    !== undefined ? (parseInt(dto.pg_guided)    || 0) : profile.pg_guided;
  const newAdminRoles         = nj('admin_roles',   typeof profile.admin_roles === 'string' ? profile.admin_roles : JSON.stringify(profile.admin_roles));
  const newMemberships        = nj('memberships',   typeof profile.memberships === 'string'  ? profile.memberships  : JSON.stringify(profile.memberships));

  await pool.execute(
    `UPDATE faculty_profiles
     SET department_id = ?, designation = ?, qualification = ?, specialization = ?,
         experience = ?, bio = ?, publications = ?, research_work = ?, subjects = ?,
         profile_image_file_id = ?,
         office_location = ?, phone_ext = ?, orcid_id = ?, scopus_h_index = ?,
         total_citations = ?, linkedin_url = ?, google_scholar_url = ?, personal_website = ?,
         phd_guided = ?, phd_ongoing = ?, pg_guided = ?,
         admin_roles = ?, memberships = ?
     WHERE id = ?`,
    [
      newDepartmentId, newDesignation, newQualification, newSpecialization,
      newExperience, newBio, newPublications, newResearchWork, newSubjects,
      newProfileImageFileId,
      newOfficeLocation, newPhoneExt, newOrcidId, newScopusHIndex,
      newTotalCitations, newLinkedinUrl, newGoogleScholarUrl, newPersonalWebsite,
      newPhdGuided, newPhdOngoing, newPgGuided,
      newAdminRoles, newMemberships,
      id,
    ]
  );

  const changed = [];
  if (newDepartmentId       !== profile.department_id)          changed.push('department_id');
  if (newDesignation        !== profile.designation)            changed.push('designation');
  if (newQualification      !== profile.qualification)          changed.push('qualification');
  if (newSpecialization     !== profile.specialization)         changed.push('specialization');
  if (newExperience         !== profile.experience)             changed.push('experience');
  if (newBio                !== profile.bio)                    changed.push('bio');
  if (newSubjects           !== profile.subjects)               changed.push('subjects');
  if (newOfficeLocation     !== profile.office_location)        changed.push('office_location');
  if (newOrcidId            !== profile.orcid_id)               changed.push('orcid_id');
  if (newScopusHIndex       !== profile.scopus_h_index)         changed.push('scopus_h_index');
  if (newTotalCitations     !== profile.total_citations)        changed.push('total_citations');
  if (newLinkedinUrl        !== profile.linkedin_url)           changed.push('linkedin_url');
  if (newPhdGuided          !== profile.phd_guided)             changed.push('phd_guided');
  if (newAdminRoles         !== profile.admin_roles)            changed.push('admin_roles');
  if (newMemberships        !== profile.memberships)            changed.push('memberships');

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
  if (dto.department_id !== undefined || dto.user_id !== undefined) {
    throw httpError('TEACHER cannot change department_id or user_id', 403);
  }

  const isHod = actor.role === 'HOD';
  let profile = await fetchProfileByUserId(actor.id);

  if (!profile) {
    // Auto-create a minimal profile row on first save.
    const [uRows] = await pool.execute(
      'SELECT department_id FROM users WHERE id = ?',
      [actor.id]
    );
    if (!uRows[0]) throw httpError('User not found', 404);
    const deptId = uRows[0].department_id;
    if (!deptId) throw httpError('User has no department assigned', 400);

    // HODs are immediately ACTIVE — no review required.
    // Teachers start as INACTIVE and need HOD approval.
    const autoStatus = isHod ? 'ACTIVE' : 'INACTIVE';

    await pool.execute(
      `INSERT INTO faculty_profiles (user_id, department_id, designation, status)
       VALUES (?, ?, ?, ?)`,
      [actor.id, deptId, dto.designation || (isHod ? 'Head of Department' : 'Faculty'), autoStatus]
    );
    profile = await fetchProfileByUserId(actor.id);
  } else if (isHod && profile.status === 'INACTIVE') {
    // Activate an existing-but-inactive HOD profile when they save.
    await pool.execute(
      `UPDATE faculty_profiles SET status = 'ACTIVE' WHERE id = ?`,
      [profile.id]
    );
  }

  // For HODs: sync departments.hod_user_id so the public department hero shows
  // the correct HOD name / email via the users table JOIN.
  // Safe: actor.department_id comes from the validated JWT.
  if (isHod && profile.department_id) {
    await pool.execute(
      `UPDATE departments SET hod_user_id = ? WHERE id = ?`,
      [actor.id, profile.department_id]
    );
  }

  // "Submit for Approval": teacher re-submits after a previous approval — move
  // status back to INACTIVE so the HOD sees it in the pending review queue again.
  if (!isHod && dto.status === 'pending' && profile.status === 'ACTIVE') {
    await pool.execute(
      `UPDATE faculty_profiles SET status = 'INACTIVE' WHERE id = ?`,
      [profile.id]
    );
  }

  // Allow teacher to update their display name (stored in users.name, not faculty_profiles).
  if (dto.name !== undefined && String(dto.name).trim()) {
    await pool.execute(
      `UPDATE users SET name = ? WHERE id = ?`,
      [String(dto.name).trim(), actor.id]
    );
  }

  // Strip frontend-only fields before passing to updateProfile.
  const profileDto = Object.assign({}, dto);
  delete profileDto.name;
  delete profileDto.status;

  return updateProfile(profile.id, profileDto, actor);
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

/**
 * Return INACTIVE faculty profiles for a given department.
 * Used by HOD to see profiles pending their review/approval.
 * CENTRAL_ADMIN can omit deptId to see all departments.
 */
async function listPendingProfiles(deptId) {
  const conditions = ["fp.status = 'INACTIVE'"];
  const params     = [];
  if (deptId) {
    conditions.push('fp.department_id = ?');
    params.push(parseInt(deptId));
  }
  const [rows] = await pool.execute(
    `SELECT ${FACULTY_COLS} ${FROM_CLAUSE}
     WHERE ${conditions.join(' AND ')}
     ORDER BY fp.updated_at DESC`,
    params
  );
  return rows;
}

module.exports = {
  listFaculty,
  listPendingProfiles,
  getProfile,
  getMyProfile,
  createProfile,
  updateProfile,
  updateMyProfile,
  setStatus,
  softDelete,
};
