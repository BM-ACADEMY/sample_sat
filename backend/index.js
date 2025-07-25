require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const discountRoutes = require('./routes/discountRoutes');
const questionRoutes = require('./routes/questionRoutes');
const testRoutes = require('./routes/testRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/courses', courseRoutes);
app.use('/discounts', discountRoutes);
app.use('/questions', questionRoutes);
app.use('/', testRoutes); // for /submit-test and /tests
app.use('/payment', paymentRoutes);

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
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});