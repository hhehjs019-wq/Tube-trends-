const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const Stat = mongoose.model('Stat', new mongoose.Schema({
  videoId: String,
  views: Number,
  likes: Number,
  timestamp: { type: Date, default: Date.now }
}));

async function fetchStats() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${process.env.VIDEO_ID}&key=${process.env.YOUTUBE_API_KEY}`;
  const { data } = await axios.get(url);
  const stats = data.items[0].statistics;
  return {
    views: Number(stats.viewCount),
    likes: Number(stats.likeCount)
  };
}

cron.schedule('*/5 * * * *', async () => {
  console.log('Fetching YouTube stats...');
  try {
    const data = await fetchStats();
    const stat = new Stat({
      videoId: process.env.VIDEO_ID,
      views: data.views,
      likes: data.likes
    });
    await stat.save();
    console.log('Saved:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
});

app.get('/api/stats', async (req, res) => {
  const stats = await Stat.find({ videoId: process.env.VIDEO_ID })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(stats.reverse());
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
