const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const aiRoutes = require('./routes/aiRoutes');
const sanitizeInput = require('./middleware/sanitizeMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(sanitizeInput);

// Health/status endpoint — public, part of the locked V1 scope
// ("Developer/Admin Usage: Monitors API health" in the reference doc).
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
