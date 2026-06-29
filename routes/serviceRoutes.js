const express = require('express');
const router = express.Router();
const { createServiceRecord, getVehicleHistory, getStats } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Technician'), createServiceRecord);
router.get('/history/:vehicleId', protect, getVehicleHistory);
router.get('/stats', protect, authorize('Admin'), getStats);

module.exports = router;
