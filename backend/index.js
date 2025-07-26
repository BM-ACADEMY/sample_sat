require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const discountRoutes = require('./routes/discountRoutes');
const questionRoutes = require('./routes/questionRoutes');
const testRoutes = require('./routes/testRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Add new payment routes

const app = express();

// Middleware
app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/courses', courseRoutes);
app.use('/discounts', discountRoutes);
app.use('/questions', questionRoutes);
app.use('/', testRoutes);
app.use('/', paymentRoutes); // Add new payment routes

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});