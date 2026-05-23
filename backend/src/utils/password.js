const crypto = require('crypto');

const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER   = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS  = '0123456789';
const SYMBOLS = '!@#$%^&*-_+=';
const ALL     = UPPER + LOWER + DIGITS + SYMBOLS;

/**
 * Generate a cryptographically random initial password.
 * Guarantees at least one uppercase, lowercase, digit, and symbol.
 * Default length: 20 chars.
 */
function generatePassword(length = 20) {
  const chars = [
    UPPER[crypto.randomInt(UPPER.length)],
    LOWER[crypto.randomInt(LOWER.length)],
    DIGITS[crypto.randomInt(DIGITS.length)],
    SYMBOLS[crypto.randomInt(SYMBOLS.length)],
  ];

  for (let i = 4; i < length; i++) {
    chars.push(ALL[crypto.randomInt(ALL.length)]);
  }

  // Fisher-Yates shuffle with crypto.randomInt
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

module.exports = { generatePassword };
