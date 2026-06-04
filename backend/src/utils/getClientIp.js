/**
 * Extracts the best available client IP from an Express request.
 *
 * Resolution order:
 *   1. X-Forwarded-For  — set by nginx / AWS ALB / Cloudflare (leftmost = real client)
 *   2. X-Real-IP        — set by some nginx configurations
 *   3. req.ip           — Express's own resolution (respects trust proxy setting)
 *   4. socket address   — last-resort raw socket
 *
 * After picking a value, IPv4-mapped IPv6 notation (::ffff:1.2.3.4) is stripped
 * to a clean IPv4 string, and the IPv6 loopback ::1 becomes 127.0.0.1.
 */
function normalizeIp(ip) {
  if (!ip) return null;
  const s = ip.trim();
  if (s === '::1')              return '127.0.0.1';
  if (s.startsWith('::ffff:'))  return s.slice(7);
  return s;
}

function getClientIp(req) {
  // X-Forwarded-For may contain a comma-separated list; the leftmost is the client
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = forwarded.split(',')[0];
    const ip    = normalizeIp(first);
    if (ip) return ip;
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    const ip = normalizeIp(realIp);
    if (ip) return ip;
  }

  return normalizeIp(req.ip) || normalizeIp(req.socket?.remoteAddress) || null;
}

module.exports = getClientIp;
