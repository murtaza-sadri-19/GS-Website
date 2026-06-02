const env = require('../config/env');

const ROLE_LABELS = {
  HOD:              'Head of Department (HOD)',
  TEACHER:          'Teacher',
  EXAM_CONTROLLER:  'Exam Controller',
  PLACEMENT_OFFICER:'Placement Officer',
  CENTRAL_ADMIN:    'Central Administrator',
};

/**
 * Welcome email sent when a new portal account is created.
 *
 * @param {object} opts
 * @param {string} opts.name           - New user's full name
 * @param {string} opts.email          - New user's email (their login)
 * @param {string} opts.password       - Plaintext initial password (shown once)
 * @param {string} opts.role           - Role name (e.g. 'TEACHER', 'HOD')
 * @param {string} opts.createdByName  - Name of the admin/HOD who created the account
 * @param {string} opts.createdByRole  - Role of the creator (e.g. 'CENTRAL_ADMIN', 'HOD')
 */
function welcomeEmail({ name, email, password, role, createdByName, createdByRole }) {
  const roleLabel     = ROLE_LABELS[role]     || role;
  const creatorLabel  = ROLE_LABELS[createdByRole] || createdByRole || 'Administrator';
  const loginUrl      = `${env.frontendUrl}/login`;

  // ── Plain-text fallback ─────────────────────────────────────────────────────
  const text = [
    `Dear ${name},`,
    '',
    `Your SGSITS Portal account has been created by ${createdByName} (${creatorLabel}).`,
    '',
    `Role   : ${roleLabel}`,
    `Email  : ${email}`,
    `Password: ${password}`,
    '',
    `Login at: ${loginUrl}`,
    '',
    'Please change your password immediately after your first login.',
    '',
    'This is an automated message — please do not reply.',
    'SGSITS Portal',
  ].join('\n');

  // ── HTML email ──────────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your SGSITS Portal Account</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
  <tr>
    <td align="center">

      <!-- Card -->
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header bar -->
        <tr>
          <td style="background:#0b2545;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:.5px;">SGSITS Portal</p>
            <p style="margin:6px 0 0;font-size:13px;color:#bfc8d6;">Shri G.S. Institute of Technology and Science, Indore</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">

            <p style="margin:0 0 6px;font-size:16px;color:#1a2a3a;font-weight:700;">Dear ${name},</p>
            <p style="margin:0 0 20px;font-size:14px;color:#4a5568;line-height:1.6;">
              Your <strong>${roleLabel}</strong> portal account has been created by
              <strong>${createdByName}</strong> (${creatorLabel}).
              Use the credentials below to log in.
            </p>

            <!-- Credentials box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f9;border:1px solid #d8e2ec;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.8px;">Login Credentials</p>

                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;font-size:13px;color:#64748b;width:90px;">Email</td>
                      <td style="padding:4px 0;font-size:13px;color:#1e293b;font-weight:600;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;font-size:13px;color:#64748b;">Password</td>
                      <td style="padding:4px 0;">
                        <span style="display:inline-block;font-family:monospace;font-size:15px;font-weight:700;color:#0b2545;background:#dbeafe;border:1px solid #93c5fd;border-radius:4px;padding:3px 10px;letter-spacing:1px;">${password}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;font-size:13px;color:#64748b;">Role</td>
                      <td style="padding:4px 0;font-size:13px;color:#1e293b;">${roleLabel}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Warning -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#92400e;line-height:1.5;">
                  ⚠️ <strong>Change your password immediately</strong> after your first login.
                  Do not share this email with anyone.
                </td>
              </tr>
            </table>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#0b2545;border-radius:6px;">
                  <a href="${loginUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                    Log In to Portal →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
              If you did not expect this email, contact your administrator.<br />
              This is an automated message — please do not reply.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#94a3b8;">
              © SGSITS Indore &nbsp;·&nbsp; 23 Park Road, Indore – 452003, M.P., India
            </p>
          </td>
        </tr>

      </table>
      <!-- /Card -->

    </td>
  </tr>
</table>

</body>
</html>`;

  return { html, text };
}

/**
 * Password reset email sent when a user requests a password reset.
 *
 * @param {object} opts
 * @param {string} opts.resetUrl       - Full URL to the reset-password page (includes token)
 * @param {number} [opts.expiresInHours=1] - Token lifetime in hours (for display only)
 */
function passwordResetEmail({ resetUrl, expiresInHours = 1 }) {
  const text = [
    'You requested a password reset for your SGSITS Portal account.',
    '',
    `Reset your password here: ${resetUrl}`,
    '',
    `This link expires in ${expiresInHours} hour${expiresInHours === 1 ? '' : 's'}.`,
    '',
    'If you did not request this, you can safely ignore this email.',
    'Your password will not change unless you click the link above.',
    '',
    'This is an automated message — please do not reply.',
    'SGSITS Portal',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reset Your SGSITS Portal Password</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
  <tr>
    <td align="center">

      <!-- Card -->
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header bar -->
        <tr>
          <td style="background:#0b2545;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:.5px;">SGSITS Portal</p>
            <p style="margin:6px 0 0;font-size:13px;color:#bfc8d6;">Shri G.S. Institute of Technology and Science, Indore</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">

            <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#1a2a3a;">Reset your password</p>
            <p style="margin:0 0 24px;font-size:14px;color:#4a5568;line-height:1.6;">
              We received a request to reset the password for your SGSITS Portal account.
              Click the button below to choose a new password.
            </p>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#0b2545;border-radius:6px;">
                  <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                    Reset Password →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Expiry notice -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#92400e;line-height:1.5;">
                  ⏱ This link expires in <strong>${expiresInHours} hour${expiresInHours === 1 ? '' : 's'}</strong>.
                  After that you will need to request a new reset link.
                </td>
              </tr>
            </table>

            <!-- Fallback URL -->
            <p style="margin:0 0 4px;font-size:12px;color:#64748b;">If the button doesn't work, copy and paste this link:</p>
            <p style="margin:0 0 24px;font-size:11px;color:#0b2545;word-break:break-all;">${resetUrl}</p>

            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
              If you did not request a password reset, no action is needed — your password will not change.<br />
              This is an automated message — please do not reply.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#94a3b8;">
              &copy; SGSITS Indore &nbsp;&middot;&nbsp; 23 Park Road, Indore &ndash; 452003, M.P., India
            </p>
          </td>
        </tr>

      </table>
      <!-- /Card -->

    </td>
  </tr>
</table>

</body>
</html>`;

  return { html, text };
}

module.exports = { welcomeEmail, passwordResetEmail };
