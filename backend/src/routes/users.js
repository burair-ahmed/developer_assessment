'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');
const { list, getById, create, update, destroy } = require('../controllers/usersController');

const router = express.Router();

// All routes require a valid JWT
router.use(authenticate);

// GET /api/users - paginated list (viewer + admin)
router.get('/', requirePermission('users:read'), list);

// GET /api/users/:id (viewer + admin)
router.get('/:id', requirePermission('users:read'), getById);

// POST /api/users (admin only)
router.post('/', requirePermission('users:create'), create);

// PUT /api/users/:id (admin only)
router.put('/:id', requirePermission('users:update'), update);

// DELETE /api/users/:id (admin only)
router.delete('/:id', requirePermission('users:delete'), destroy);

module.exports = router;
