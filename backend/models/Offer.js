const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Offer model with multilingual message
const Offer = sequelize.define('Offer', {
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  message_en: DataTypes.TEXT,
  message_mn: DataTypes.TEXT,
  message_zh: DataTypes.TEXT,
  message_ru: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
});

module.exports = Offer;
