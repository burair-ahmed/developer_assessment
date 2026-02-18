'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'role_id' });
    }
  }
  User.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: 'password_hash' },
      name: { type: DataTypes.STRING(255), allowNull: true },
      roleId: { type: DataTypes.INTEGER, allowNull: false, field: 'role_id' },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: { attributes: {} },
      },
    }
  );
  return User;
};
