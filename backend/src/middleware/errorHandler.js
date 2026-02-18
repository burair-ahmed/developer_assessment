'use strict';

/**
 * Central error handler. Must be registered last.
 * Sends JSON { error: message } and appropriate status code.
 */
function errorHandler(err, req, res, next) {
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
