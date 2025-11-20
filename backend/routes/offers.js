const express = require('express');
const Joi = require('joi');
const { Offer, Shipment } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Validation schema for offers
const offerSchema = Joi.object({
  price: Joi.number().required(),
  message_en: Joi.string().allow('', null),
  message_mn: Joi.string().allow('', null),
  message_zh: Joi.string().allow('', null),
  message_ru: Joi.string().allow('', null),
});

// Create offer (carrier only)
router.post('/shipments/:shipmentId/offers', authenticate, authorize('carrier'), async (req, res) => {
  try {
    const { error, value } = offerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const shipment = await Shipment.findByPk(req.params.shipmentId);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    const offer = await Offer.create({ ...value, shipmentId: shipment.id, carrierId: req.user.id });
    return res.status(201).json(offer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List offers for a shipment (shipper owner only)
router.get('/shipments/:shipmentId/offers', authenticate, authorize('shipper'), async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.shipmentId);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    if (shipment.shipperId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const offers = await Offer.findAll({ where: { shipmentId: shipment.id }, order: [['createdAt', 'DESC']] });
    return res.json(offers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update offer status (shipper owner)
router.put('/offers/:id', authenticate, authorize('shipper'), async (req, res) => {
  try {
    const statusSchema = Joi.object({ status: Joi.string().valid('pending', 'accepted', 'rejected').required() });
    const { error, value } = statusSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const offer = await Offer.findByPk(req.params.id, { include: Shipment });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (offer.Shipment.shipperId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await offer.update({ status: value.status });
    if (value.status === 'accepted') {
      await offer.Shipment.update({ status: 'in-progress' });
    }
    return res.json(offer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
