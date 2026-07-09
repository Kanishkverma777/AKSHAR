/**
 * Global error handler — catches all unhandled errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry — a record with this key already exists.',
      detail: err.detail,
    });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: 'Foreign key violation — referenced record does not exist.',
      detail: err.detail,
    });
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      error: 'Check constraint violation.',
      detail: err.detail,
    });
  }

  // PostgreSQL not-null violation
  if (err.code === '23502') {
    return res.status(400).json({
      success: false,
      error: `Missing required field: ${err.column}`,
      detail: err.detail,
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error.',
  });
};

module.exports = errorHandler;
