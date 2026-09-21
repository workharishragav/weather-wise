const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Strip HTML tags as a basic XSS mitigation, and trim whitespace.
    return value.replace(/<[^>]*>?/gm, '').trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return sanitizeObject(value);
  }
  return value;
};

const sanitizeObject = (obj) => {
  const clean = {};
  for (const key of Object.keys(obj)) {
    // Drop keys that look like Mongo operator injection attempts
    // (e.g. { "email": { "$gt": "" } }) or dotted-path injection.
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = sanitizeValue(obj[key]);
  }
  return clean;
};

/**
 * Sanitizes req.body against basic XSS payloads and NoSQL operator
 * injection. req.query/req.params are intentionally left alone:
 * Express 5 makes req.query read-only (no setter), and every route
 * param in this app is passed through Mongoose, which safely casts
 * or rejects malformed ObjectIds rather than interpolating them raw.
 */
const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

module.exports = sanitizeInput;
