// // backend/server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// // Routes
// const authRoutes = require('./routes/auth.route');
// const chatRoutes = require('./routes/chat.route');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// // Middleware
// app.use(cors({
//     // origin: 'http://localhost:5173', // Frontend URL
//     origin: FRONTEND_URL,
//     credentials: true, // Allow cookies/JWT
// }));
// app.use(express.json()); // Body parser

// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected successfully'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Routes usage
// app.use('/api/auth', authRoutes);
// app.use('/api/chat', chatRoutes);

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;
// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth.route');
const chatRoutes = require('./routes/chat.route');

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ✅ Allow multiple frontend origins (local + vercel)
const allowedOrigins = [
  'http://localhost:5173',
  'https://chatbot-woad-ten.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Basic test route
app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
});

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Use your routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// ❌ REMOVE app.listen() — Vercel handles this internally
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
