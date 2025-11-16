const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  videoId: String,
  views: Number,
  likes: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stat', statSchema);
