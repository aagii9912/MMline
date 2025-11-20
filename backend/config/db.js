// Sequelize connection configuration
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Use DATABASE_URL for Postgres connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
