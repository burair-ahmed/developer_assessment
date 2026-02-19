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
      // Use the plural of the model name for the association
      const role = await Role.findOne({
        where: { name: req.user.role },
        include: [{ 
          association: 'Permissions', 
          attributes: ['code', 'name'],
          through: { attributes: [] } 
        }],
      });

      if (!role) {
        console.error(`[RBAC] Role not found: ${req.user.role}`);
        return res.status(403).json({ error: 'Forbidden: Role not found' });
      }

      const permissions = role.Permissions || [];
      const permissionCodes = permissions.map((p) => p.code);
      
      console.log(`[RBAC] User: ${req.user.id}, Role: ${req.user.role}, Required: ${permissionName}, Has: ${permissionCodes.join(', ')}`);

      if (!permissionCodes.includes(permissionName)) {
        return res.status(403).json({ error: 'Forbidden: Missing permission' });
      }

      next();
    } catch (err) {
      console.error('[RBAC] Error:', err);
      next(err);
    }
  };
}

module.exports = { requirePermission };
