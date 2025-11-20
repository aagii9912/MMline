// Initialize all models and associations
const sequelize = require('../config/db');
const User = require('./User');
const Shipment = require('./Shipment');
const Offer = require('./Offer');

// Associations
User.hasMany(Shipment, { foreignKey: 'shipperId', onDelete: 'CASCADE' });
Shipment.belongsTo(User, { as: 'shipper', foreignKey: 'shipperId' });

Shipment.hasMany(Offer, { foreignKey: 'shipmentId', onDelete: 'CASCADE' });
Offer.belongsTo(Shipment, { foreignKey: 'shipmentId' });

User.hasMany(Offer, { foreignKey: 'carrierId', onDelete: 'CASCADE' });
Offer.belongsTo(User, { as: 'carrier', foreignKey: 'carrierId' });

// Sync helper for scripts
const initDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

module.exports = { sequelize, User, Shipment, Offer, initDb };
