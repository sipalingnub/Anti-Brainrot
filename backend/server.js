const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Kamu sudah import ini, ayo kita pakai!

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Limit besar biar aman upload gambar
app.use(express.urlencoded({ extended: true }));

// --- PERBAIKAN: Gunakan path.join agar folder terbaca sempurna di semua OS ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));

// Health Check
app.get('/api', (req, res) => {
  res.json({ message: 'Anti-Brainrot API Running!', time: new Date() });
});

// Reset DB (Dev only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/reset-db', async (req, res) => {
    await mongoose.connection.db.dropDatabase();
    res.json({ message: 'Database dihapus total!' });
  });
}

// 404 Handler (Paling Bawah)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route tidak ditemukan',
    path: req.originalUrl,
    method: req.method
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});