'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint for production troubleshooting
app.get('/api/health', async (req, res) => {
  try {
    const { sequelize } = require('./models');
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

module.exports = app;
