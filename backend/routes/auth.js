const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, dailyLimit } = req.body;
        if (!name || !email || !password) return res.status(400).json({ msg: "Field kurang lengkap" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "Email sudah terdaftar" });

        const newUser = new User({ name, email, password, dailyLimit });
        await newUser.save();

        res.status(201).json({ msg: "Registrasi berhasil!" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User tidak ditemukan' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Password salah' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.name,
          email: user.email,
          dailyLimit: user.dailyLimit,
          // Kirim data game juga
          xp: user.xp,
          level: user.level,
          badges: user.badges
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET USER DATA (Updated with Gamification stats)
router.get('/me', auth, async (req, res) => {
  try {
    // User sudah didapat dari middleware auth, tapi kita fetch ulang untuk data terbaru
    const user = await User.findById(req.user._id).select('-password'); 
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- NEW ROUTE: LEADERBOARD ---
router.get('/leaderboard', async (req, res) => {
    try {
        // Ambil top 10 user berdasarkan XP tertinggi
        const users = await User.find()
            .select('name xp level badges')
            .sort({ xp: -1 })
            .limit(10);
        
        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal mengambil leaderboard" });
    }
});

module.exports = router;