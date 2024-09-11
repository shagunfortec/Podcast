const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['audio', 'video', 'post'],
    required: true,
  },
  contentUrl: { type: String }, // For audio/video URLs
  description: { type: String },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Channel', channelSchema);
