const Channel = require('../models/channel');

// Create new channel content (audio, video, post)
exports.createChannel = async (req, res, next) => {
  const { title, type, contentUrl, description } = req.body;

  const channel = await Channel.create({
    title,
    type,
    contentUrl,
    description,
    creator: req.user.id,
  });

  res.status(201).json({ success: true, channel });
};

// Update channel content
exports.updateChannel = async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel || channel.creator.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const updatedChannel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, channel: updatedChannel });
};

// Delete channel content
exports.deleteChannel = async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel || channel.creator.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await channel.remove();
  res.status(200).json({ success: true, message: 'Channel content deleted' });
};

// Get all channel content
exports.getAllChannels = async (req, res, next) => {
  const channels = await Channel.find().populate('creator', 'name role');

  res.status(200).json({ success: true, channels });
};
