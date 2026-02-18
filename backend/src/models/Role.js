'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Permission, {
        through: 'role_permissions',
        foreignKey: 'role_id',
        otherKey: 'permission_id',
      });
      Role.hasMany(models.User, { foreignKey: 'role_id' });
    }
  }
  Role.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      underscored: true,
      timestamps: true,
    }
  );
  return Role;
};
