// Seed script to create demo users, shipment, and offer
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDb, User, Shipment, Offer } = require('./models');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
  await initDb();
  // Clear existing data for repeatable seeds
  await Offer.destroy({ where: {} });
  await Shipment.destroy({ where: {} });
  await User.destroy({ where: {} });

  const shipper = await User.create({
    name: 'Demo Shipper',
    email: 'shipper@demo',
    password: await bcrypt.hash('1234', 10),
    role: 'shipper',
    preferred_language: 'en',
  });

  const carrier = await User.create({
    name: 'Demo Carrier',
    email: 'carrier@demo',
    password: await bcrypt.hash('1234', 10),
    role: 'carrier',
    preferred_language: 'mn',
  });

  const shipment = await Shipment.create({
    shipperId: shipper.id,
    title_en: 'Electronics Pallet',
    title_mn: 'Цахилгаан барааны тавцан',
    title_zh: '电子产品托盘',
    title_ru: 'Паллет электроники',
    description_en: 'Fragile electronics from LA to SF',
    description_mn: 'Эвдрэлтэй цахилгаан барааг ЛА-гаас СФ хүртэл тээвэрлэх',
    description_zh: '易碎电子产品从洛杉矶到旧金山运输',
    description_ru: 'Хрупкая электроника из Лос-Анджелеса в Сан-Франциско',
    origin: 'Los Angeles',
    destination: 'San Francisco',
    weight: 1200,
    price_min: 800,
    price_max: 1200,
    status: 'open',
  });

  const offer = await Offer.create({
    shipmentId: shipment.id,
    carrierId: carrier.id,
    price: 950,
    message_en: 'We can deliver within 2 days.',
    message_mn: '2 өдрийн дотор хүргэнэ.',
    message_zh: '我们可以在2天内交付。',
    message_ru: 'Доставим за 2 дня.',
    status: 'pending',
  });

  const shipperToken = jwt.sign({ id: shipper.id, role: shipper.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const carrierToken = jwt.sign({ id: carrier.id, role: carrier.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  console.log('Seed complete');
  console.log('Shipper login -> email: shipper@demo password: 1234');
  console.log('Carrier login -> email: carrier@demo password: 1234');
  console.log('Sample shipment id:', shipment.id);
  console.log('Sample offer id:', offer.id);
  console.log('Shipper token:', shipperToken);
  console.log('Carrier token:', carrierToken);
};

run()
  .then(() => process.exit())
  .catch((err) => {
    console.error('Seed failed', err);
    process.exit(1);
  });
