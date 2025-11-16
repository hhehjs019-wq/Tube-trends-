const mongoose = require('mongoose');

module.exports = mongoose.model('Stat', new mongoose.Schema({
  videoId: String,
  views: Number,
  likes: Number,
  timestamp: { type: Date, default: Date.now }
}));
