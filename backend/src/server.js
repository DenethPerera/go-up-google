const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const locationRoutes  = require('./features/locations/location.routes');
const categoryRoutes  = require('./features/categories/category.routes');
const { globalErrorHandler } = require('./middleware/errorHandler');

// ─── Database ────────────────────────────────────────────────────────────────
connectDB();

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/status', (_req, res) => {
  res.json({ success: true, message: 'Go-Up-Google API is running.' });
});


app.use('/api/locations',  locationRoutes);
app.use('/api/categories', categoryRoutes);


app.use(globalErrorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const os = require('os');

const getLanIp = () => {
  const nets = os.networkInterfaces();
  for (const iface of Object.values(nets)) {
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
};

app.listen(PORT, '0.0.0.0', () => {
  const lanIp = getLanIp();
  console.log(`🚀 Server running on:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${lanIp}:${PORT}`);
});