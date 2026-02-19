'use strict';

const { Role } = require('../models');

/**
 * Role-based access control middleware.
 * Must run after authenticate() so req.user = { id, role } is set.
 *
 * requirePermission('users:read') -> allows if role is admin or role has that permission in DB.
 * On failure: 403 JSON { error: 'Forbidden' }
 *
 * @param {string} permissionName - e.g. 'users:read', 'users:create'
 */
function requirePermission(permissionName) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    try {
      const role = await Role.findOne({
        where: { name: req.user.role },
        include: [{ association: 'Permissions', attributes: ['name'] }],
      });

      if (!role) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const permissionCodes = (role.Permissions || []).map((p) => p.code);
      if (!permissionCodes.includes(permissionName)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { requirePermission };
