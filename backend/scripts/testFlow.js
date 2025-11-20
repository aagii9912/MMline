// Simple flow script to exercise API endpoints
const axios = require('axios').create({ baseURL: 'http://localhost:5000/api' });

const main = async () => {
  try {
    // Register shipper
    await axios.post('/auth/register', {
      name: 'Tester Shipper',
      email: 'shipper+' + Date.now() + '@demo',
      password: '1234',
      role: 'shipper',
    });
    const carrierEmail = 'carrier+' + Date.now() + '@demo';
    await axios.post('/auth/register', {
      name: 'Tester Carrier',
      email: carrierEmail,
      password: '1234',
      role: 'carrier',
    });

    // Login
    const shipperLogin = await axios.post('/auth/login', { email: 'shipper@demo', password: '1234' });
    const carrierLogin = await axios.post('/auth/login', { email: 'carrier@demo', password: '1234' });
    const shipperToken = shipperLogin.data.token;
    const carrierToken = carrierLogin.data.token;

    // Create shipment
    const created = await axios.post(
      '/shipments',
      {
        title_en: 'API Test Load',
        title_mn: 'API ачаа',
        title_zh: 'API货物',
        title_ru: 'API груз',
        description_en: 'From A to B',
        description_mn: 'A-аас B рүү',
        description_zh: '从A到B',
        description_ru: 'Из А в Б',
        origin: 'A City',
        destination: 'B City',
        weight: 10,
        price_min: 100,
        price_max: 150,
      },
      { headers: { Authorization: `Bearer ${shipperToken}` } }
    );

    // Carrier offers
    const offer = await axios.post(
      `/shipments/${created.data.id}/offers`,
      {
        price: 120,
        message_en: 'Can move fast',
        message_mn: 'Түргэн зөөнө',
        message_zh: '可以快速运输',
        message_ru: 'Доставлю быстро',
      },
      { headers: { Authorization: `Bearer ${carrierToken}` } }
    );

    // Shipper accepts
    const accepted = await axios.put(
      `/offers/${offer.data.id}`,
      { status: 'accepted' },
      { headers: { Authorization: `Bearer ${shipperToken}` } }
    );

    console.log('Flow success', {
      shipmentId: created.data.id,
      offerId: offer.data.id,
      offerStatus: accepted.data.status,
    });
  } catch (err) {
    console.error('Flow failed', err.response?.data || err.message);
  }
};

main();
