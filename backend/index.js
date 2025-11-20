// Express app bootstrap
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./models');
const authRoutes = require('./routes/auth');
const shipmentRoutes = require('./routes/shipments');
const offerRoutes = require('./routes/offers');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api', offerRoutes);

const PORT = process.env.PORT || 5000;

// Initialize DB then start server
initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
