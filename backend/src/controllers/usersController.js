'use strict';

const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MIN_PASSWORD_LENGTH = 6;

function toUserResponse(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.Role?.name,
    ...(u.roleId != null && { roleId: u.roleId }),
    ...(u.createdAt != null && { createdAt: u.createdAt }),
  };
}

/** GET /users - paginated list */
async function list(req, res, next) {
  try {
    let page = Math.max(1, parseInt(req.query.page, 10) || DEFAULT_PAGE);
    let limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'email', 'name', 'roleId'],
      include: [{ association: 'Role', attributes: ['name'] }],
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'ASC']],
    });

    const totalPages = Math.ceil(count / limit) || 1;
    res.json({
      users: rows.map(toUserResponse),
      pagination: { page, limit, total: count, totalPages },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /users/:id */
async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'name', 'roleId', 'createdAt'],
      include: [{ association: 'Role', attributes: ['name'] }],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: toUserResponse(user) });
  } catch (err) {
    next(err);
  }
}

/** POST /users */
async function create(req, res, next) {
  try {
    const { email, password, name, roleId } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!/^.+\@.+\..+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    if (roleId == null) {
      return res.status(400).json({ error: 'roleId is required' });
    }
    const roleIdNum = parseInt(roleId, 10);
    if (Number.isNaN(roleIdNum)) {
      return res.status(400).json({ error: 'roleId must be a number' });
    }

    const role = await Role.findByPk(roleIdNum);
    if (!role) {
      return res.status(400).json({ error: 'Invalid roleId' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: normalizedEmail,
      passwordHash: hash,
      name: name != null && typeof name === 'string' ? name.trim() || null : null,
      roleId: roleIdNum,
    });

    const withRole = await User.findByPk(user.id, {
      attributes: ['id', 'email', 'name', 'roleId'],
      include: [{ association: 'Role', attributes: ['name'] }],
    });
    res.status(201).json({ user: toUserResponse(withRole) });
  } catch (err) {
    next(err);
  }
}

/** PUT /users/:id */
async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const { email, password, name, roleId } = req.body;
    const updates = {};
    let hasUpdate = false;

    if (email !== undefined) {
      if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ error: 'Email must be a non-empty string' });
      }
      if (!/^.+\@.+\..+$/.test(email.trim())) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      updates.email = email.trim().toLowerCase();
      hasUpdate = true;
    }
    if (password !== undefined) {
      if (typeof password !== 'string') {
        return res.status(400).json({ error: 'Password must be a string' });
      }
      if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
      }
      updates.passwordHash = await bcrypt.hash(password, 10);
      hasUpdate = true;
    }
    if (name !== undefined) {
      updates.name = name != null && typeof name === 'string' ? name.trim() || null : null;
      hasUpdate = true;
    }
    if (roleId !== undefined) {
      const roleIdNum = parseInt(roleId, 10);
      if (Number.isNaN(roleIdNum)) {
        return res.status(400).json({ error: 'roleId must be a number' });
      }
      const role = await Role.findByPk(roleIdNum);
      if (!role) {
        return res.status(400).json({ error: 'Invalid roleId' });
      }
      updates.roleId = roleIdNum;
      hasUpdate = true;
    }

    if (!hasUpdate) {
      return res.status(400).json({ error: 'Provide at least one field to update: email, password, name, roleId' });
    }

    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'name', 'roleId', 'createdAt'],
      include: [{ association: 'Role', attributes: ['name'] }],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (updates.email && updates.email !== user.email) {
      const existing = await User.findOne({ where: { email: updates.email } });
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    await user.update(updates);
    const updated = await User.findByPk(user.id, {
      attributes: ['id', 'email', 'name', 'roleId', 'createdAt'],
      include: [{ association: 'Role', attributes: ['name'] }],
    });
    res.json({ user: toUserResponse(updated) });
  } catch (err) {
    next(err);
  }
}

/** DELETE /users/:id */
async function destroy(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.id === req.user.id) {
      return res.status(403).json({ error: 'Cannot delete your own account' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, destroy };
