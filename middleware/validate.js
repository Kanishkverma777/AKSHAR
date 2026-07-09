const { validationResult } = require('express-validator');

/**
 * Middleware that runs after express-validator checks.
 * If validation fails, returns 400 with error details.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = validate;
