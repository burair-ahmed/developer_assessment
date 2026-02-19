'use strict';

// Ensure the PostgreSQL driver is included in the Vercel bundle
require('pg');

// This is the serverless entry point for Vercel.
// It imports the Express app from the backend source.

const app = require('../backend/src/app');

module.exports = app;
