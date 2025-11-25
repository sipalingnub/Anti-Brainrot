const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Model & Middleware
const Activity = require('../models/activity'); 
const User = require('../models/user'); 
const auth = require('../middleware/auth');

// Cek folder upload
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Konfigurasi Multer (Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    if (allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// @route   POST /api/activities
// @desc    Create activity & Update XP/Level
router.post('/', auth, upload.single('screenshot'), async (req, res) => {
  try {
    const { platform, category, duration, description, mood, date } = req.body;

    // Validasi Input
    if (!platform || !category || !duration) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    const durationInt = parseInt(duration) || 0;

    // 1. Simpan Aktivitas
    const activityData = {
      user: req.user.id || req.user._id,
      platform,
      category,
      duration: durationInt, 
      description,
      mood,
      date: date || new Date()
    };

    // FIX IMAGE: Ganti backslash (\) jadi slash (/) agar terbaca di browser
    if (req.file) {
        activityData.screenshot = req.file.path.replace(/\\/g, '/');
    }

    const activity = new Activity(activityData);
    await activity.save();

    // 2. HITUNG XP & GAMIFIKASI
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId); 
    
    if (user) {
        let xpGained = 0;
        
        // Logika XP
        if (category === 'productive') xpGained = durationInt * 10;
        else if (category === 'neutral') xpGained = durationInt * 2;
        
        user.xp = (user.xp || 0) + xpGained;

        // Cek Level Up
        const currentLevel = user.level || 1;
        const xpNeeded = currentLevel * 500;
        
        if (user.xp >= xpNeeded) {
            user.level = currentLevel + 1;
        }

        // Badges Logic
        if (!user.badges) user.badges = []; 
        if (!user.badges.find(b => b.id === 'first_step')) {
            user.badges.push({ id: 'first_step', name: 'First Step', icon: '🦶' });
        }
        if (user.level >= 2 && !user.badges.find(b => b.id === 'novice')) {
            user.badges.push({ id: 'novice', name: 'Novice Grinder', icon: '🥉' });
        }
        if (user.xp >= 1000 && !user.badges.find(b => b.id === 'master')) {
            user.badges.push({ id: 'master', name: 'Productivity Master', icon: '👑' });
        }

        await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Quest completed!',
      data: { activity }
    });

  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/activities
router.get('/', auth, async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const userId = req.user.id || req.user._id;
    const query = { user: userId };
    
    if (category && category !== 'all') {
        query.category = category;
    }

    const activities = await Activity.find(query).sort({ date: -1 }).limit(parseInt(limit));
    res.json({ success: true, count: activities.length, data: { activities } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/activities/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { period = 'week' } = req.query;

    // 1. Ambil SEMUA data user dulu (Cara paling aman)
    const allActivities = await Activity.find({ user: userId }).sort({ date: -1 });

    // 2. Filter Manual menggunakan Javascript (Lebih akurat untuk localhost)
    const now = new Date();
    // Set "Awal Hari Ini" (Jam 00:00 waktu server/laptop)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Tentukan batas waktu filter periode
    let filterDate = new Date(startOfToday);
    if (period === 'week') filterDate.setDate(filterDate.getDate() - 7);
    else if (period === 'month') filterDate.setMonth(filterDate.getMonth() - 1);
    else if (period === 'all') filterDate = new Date(0); // Sejak jaman purba

    // 3. Lakukan Filter & Perhitungan
    let totalMinutes = 0;
    let brainrotMinutes = 0;
    let productiveMinutes = 0;
    let todayMinutes = 0;
    let platformStats = {};

    allActivities.forEach(act => {
        const actDate = new Date(act.date);
        const duration = parseInt(act.duration) || 0; // Pastikan jadi Angka

        // Hitung Stats Hari Ini (Daily Mana)
        if (actDate >= startOfToday) {
            todayMinutes += duration;
        }

        // Hitung Stats Sesuai Periode (Week/Month)
        if (actDate >= filterDate) {
            totalMinutes += duration;

            if (act.category === 'brainrot') brainrotMinutes += duration;
            if (act.category === 'productive') productiveMinutes += duration;

            // Stats Platform
            platformStats[act.platform] = (platformStats[act.platform] || 0) + duration;
        }
    });

    // 4. Cek User Limit
    const user = await User.findById(userId);

    // Kirim Data
    res.json({
      success: true,
      data: {
        totalMinutes,
        totalHours: (totalMinutes / 60).toFixed(1),
        brainrotMinutes,
        productiveMinutes,
        brainrotPercentage: totalMinutes > 0 ? Math.round((brainrotMinutes / totalMinutes) * 100) : 0,
        platformStats,
        dailyAverage: Math.round(totalMinutes / (period === 'all' ? 30 : 7)),
        
        // INI KUNCI AGAR DAILY MANA MUNCUL
        todayMinutes: todayMinutes, 
        isOverLimit: user ? todayMinutes > user.dailyLimit : false,
        
        // Debugging info (biar tau ada berapa data)
        activityCount: allActivities.length 
      }
    });

  } catch (error) {
    console.error("Error stats:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/activities/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const activity = await Activity.findOne({ _id: req.params.id, user: userId });
    
    if (!activity) return res.status(404).json({ success: false, message: 'Not found' });
    
    // Hapus file gambar jika ada (Opsional, agar hemat storage)
    if (activity.screenshot) {
        const filePath = path.join(__dirname, '..', activity.screenshot);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    
    await activity.deleteOne();
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;