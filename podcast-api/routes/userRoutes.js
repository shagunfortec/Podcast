const express = require('express');
const { registerUser, loginUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// Apply authentication middleware if needed

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update', updateUser);
router.delete('/delete', deleteUser);

module.exports = router;
