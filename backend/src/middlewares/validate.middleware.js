const { error } = require('../utils/response');

/**
 * Zod-based request validation middleware.
 *
 *   const { z } = require('zod');
 *   router.post('/', validate(z.object({ title: z.string().min(1) })), controller.create)
 *
 * By default validates `req.body`. Pass `source` to validate 'query' or 'params'.
 * On success the parsed (and coerced) value replaces the original, so controllers
 * receive clean, typed data. On failure returns a 422 with field-level details.
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join('.') || source,
      message: i.message,
    }));
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      error: details,
    });
  }
  req[source] = result.data;
  next();
};

module.exports = { validate };
