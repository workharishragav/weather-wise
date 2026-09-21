const jwt = require('jsonwebtoken');

/**
 * Signs a JWT carrying the user's id and role.
 * JWT_SECRET must be set in the environment; there is intentionally no
 * fallback secret, so misconfiguration fails loudly instead of signing
 * tokens with a predictable key.
 */
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;
