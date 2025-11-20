const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Shipment model with multilingual title/description
const Shipment = sequelize.define('Shipment', {
  title_en: DataTypes.STRING,
  title_mn: DataTypes.STRING,
  title_zh: DataTypes.STRING,
  title_ru: DataTypes.STRING,
  description_en: DataTypes.TEXT,
  description_mn: DataTypes.TEXT,
  description_zh: DataTypes.TEXT,
  description_ru: DataTypes.TEXT,
  origin: DataTypes.STRING,
  destination: DataTypes.STRING,
  weight: DataTypes.FLOAT,
  price_min: DataTypes.FLOAT,
  price_max: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('open', 'in-progress', 'completed'),
    defaultValue: 'open',
  },
});

module.exports = Shipment;
