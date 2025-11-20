const express = require('express');
const Joi = require('joi');
const { Shipment, Offer } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Validation schema for shipment creation/update
const shipmentSchema = Joi.object({
  title_en: Joi.string().required(),
  title_mn: Joi.string().allow('', null),
  title_zh: Joi.string().allow('', null),
  title_ru: Joi.string().allow('', null),
  description_en: Joi.string().allow('', null),
  description_mn: Joi.string().allow('', null),
  description_zh: Joi.string().allow('', null),
  description_ru: Joi.string().allow('', null),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  weight: Joi.number().required(),
  price_min: Joi.number().required(),
  price_max: Joi.number().required(),
  status: Joi.string().valid('open', 'in-progress', 'completed').optional(),
});

// Create shipment (shipper only)
router.post('/', authenticate, authorize('shipper'), async (req, res) => {
  try {
    const { error, value } = shipmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const shipment = await Shipment.create({ ...value, shipperId: req.user.id });
    return res.status(201).json(shipment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List shipments with optional filters
router.get('/', async (req, res) => {
  try {
    const { origin, destination, status } = req.query;
    const where = {};
    if (origin) where.origin = origin;
    if (destination) where.destination = destination;
    if (status) where.status = status;

    const shipments = await Shipment.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json(shipments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single shipment details with offers
router.get('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id, {
      include: [{ model: Offer, include: ['carrier'] }],
    });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    return res.json(shipment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update shipment (must be owner)
router.put('/:id', authenticate, authorize('shipper'), async (req, res) => {
  try {
    const { error, value } = shipmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    if (shipment.shipperId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await shipment.update(value);
    return res.json(shipment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete shipment (owner only)
router.delete('/:id', authenticate, authorize('shipper'), async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    if (shipment.shipperId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await shipment.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
