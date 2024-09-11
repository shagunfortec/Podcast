const express = require('express');
const {
  createChannel,
  updateChannel,
  deleteChannel,
  getAllChannels,
} = require('../controllers/channelController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/channel', authenticate, authorizeRoles('admin', 'channel'), createChannel);
router.put('/channel/:id', authenticate, authorizeRoles('admin', 'channel'), updateChannel);
router.delete('/channel/:id', authenticate, authorizeRoles('admin', 'channel'), deleteChannel);
router.get('/channels', getAllChannels);

module.exports = router;
