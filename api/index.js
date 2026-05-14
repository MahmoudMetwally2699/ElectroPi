require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../backend/config/db');

connectDB();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/products', require('../backend/routes/productRoutes'));
app.use('/api/categories', require('../backend/routes/categoryRoutes'));
app.use('/api/orders', require('../backend/routes/orderRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;
