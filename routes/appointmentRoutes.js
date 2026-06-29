const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, assignTechnician, updateStatus, cancelAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Customer'), bookAppointment)
    .get(protect, getAppointments);

router.patch('/:id/assign', protect, authorize('Admin'), assignTechnician);
router.patch('/:id/status', protect, authorize('Admin', 'Technician'), updateStatus);
router.patch('/:id/cancel', protect, authorize('Customer'), cancelAppointment);

module.exports = router;
