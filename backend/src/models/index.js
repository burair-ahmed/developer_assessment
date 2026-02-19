'use strict';

const Sequelize = require('sequelize');
const pg = require('pg'); // Explicitly require pg for Vercel/Serverless bundling
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], { ...config, logging: config.logging });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Explicitly import models for Vercel/Serverless compatibility
// This avoids issues with fs.readdirSync during bundling
db.Role = require('./Role')(sequelize, Sequelize.DataTypes);
db.Permission = require('./Permission')(sequelize, Sequelize.DataTypes);
db.User = require('./User')(sequelize, Sequelize.DataTypes);

// Register associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
