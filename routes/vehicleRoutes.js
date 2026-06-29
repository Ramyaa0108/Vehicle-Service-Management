const express = require('express');
const router = express.Router();
const { addVehicle, getVehicles, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addVehicle)
    .get(protect, getVehicles);

router.route('/:id')
    .put(protect, updateVehicle)
    .delete(protect, deleteVehicle);

module.exports = router;
