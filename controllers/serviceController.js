const ServiceRecord = require('../models/ServiceRecord');
const Appointment = require('../models/Appointment');

// @desc    Create a service record
// @route   POST /api/services
// @access  Private (Technician)
const createServiceRecord = async (req, res) => {
    const { appointmentId, repairsDone, partsReplaced, maintenanceNotes } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    const serviceRecord = await ServiceRecord.create({
        appointment: appointmentId,
        vehicle: appointment.vehicle,
        technician: req.user._id,
        repairsDone,
        partsReplaced,
        maintenanceNotes
    });

    if (serviceRecord) {
        // Update appointment status to completed
        appointment.status = 'Completed';
        await appointment.save();
        res.status(201).json(serviceRecord);
    } else {
        res.status(400);
        throw new Error('Invalid service record data');
    }
};

const getVehicleHistory = async (req, res) => {
    const history = await ServiceRecord.find({ vehicle: req.params.vehicleId })
        .populate('vehicle', 'model number')
        .populate('technician', 'name')
        .sort({ createdAt: -1 });

    res.json(history);
};

// @desc    Get dashboard stats
// @route   GET /api/services/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
    const totalVehicles = await require('../models/Vehicle').countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingServices = await Appointment.countDocuments({ status: 'Pending' });
    const completedServices = await Appointment.countDocuments({ status: 'Completed' });

    res.json({
        totalVehicles,
        totalAppointments,
        pendingServices,
        completedServices
    });
};

module.exports = { createServiceRecord, getVehicleHistory, getStats };
