const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, getTechnicians } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/technicians', protect, authorize('Admin'), getTechnicians);

module.exports = router;
