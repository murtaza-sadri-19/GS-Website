const nodemailer = require('nodemailer');
const env = require('../config/env');

let _transport = null;

function getTransport() {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host:   env.smtp.host,
      port:   env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }
  return _transport;
}

/**
 * Send an email. Returns silently if SMTP is not configured.
 * Never throws — caller decides whether to log or ignore errors.
 */
async function sendMail({ to, subject, html, text }) {
  if (!env.smtp.user || !env.smtp.pass) {
    console.info('[mailer] SMTP not configured — skipping email to', to);
    return;
  }

  const transport = getTransport();
  const info = await transport.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text,
  });

  console.info('[mailer] Sent to', to, '— messageId:', info.messageId);
}

module.exports = { sendMail };
