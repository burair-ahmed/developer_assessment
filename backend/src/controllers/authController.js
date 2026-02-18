'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user: { id, email, name, role } }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.scope('withPassword').findOne({
      where: { email: email.trim().toLowerCase() },
      include: [{ association: 'Role', attributes: ['name'] }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = { sub: user.id, role: user.Role.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.Role.name,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
