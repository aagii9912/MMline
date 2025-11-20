const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

// User model with hashed password helper
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('shipper', 'carrier'),
    allowNull: false,
  },
  preferred_language: {
    type: DataTypes.ENUM('en', 'mn', 'zh', 'ru'),
    allowNull: true,
  },
});

// Instance method to compare password
User.prototype.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = User;
