const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'Facebook', 'Other']
  },
  category: {
    type: String,
    required: true,
    enum: ['brainrot', 'productive', 'neutral']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    default: ''
  },
  screenshot: {
    type: String,
    default: null
  },
  mood: {
    type: String,
    enum: ['happy', 'neutral', 'guilty', 'productive', 'waste'],
    default: 'neutral'
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);