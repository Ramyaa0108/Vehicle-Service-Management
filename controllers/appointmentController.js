const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const bookAppointment = async (req, res) => {
    const { vehicle, serviceType, date, time } = req.body;

    const appointment = await Appointment.create({
        customer: req.user._id,
        vehicle,
        serviceType,
        date,
        time
    });

    if (appointment) {
        res.status(201).json(appointment);
    } else {
        res.status(400);
        throw new Error('Invalid appointment data');
    }
};

// @desc    Get appointments (Customer: own, Tech: assigned, Admin: all)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    let appointments;
    if (req.user.role === 'Admin') {
        appointments = await Appointment.find({})
            .populate('customer', 'name email')
            .populate('vehicle', 'model number type')
            .populate('technician', 'name');
    } else if (req.user.role === 'Technician') {
        appointments = await Appointment.find({ technician: req.user._id })
            .populate('customer', 'name email')
            .populate('vehicle', 'model number type');
    } else {
        appointments = await Appointment.find({ customer: req.user._id })
            .populate('vehicle', 'model number type')
            .populate('technician', 'name');
    }
    res.json(appointments);
};

// @desc    Assign technician to appointment
// @route   PATCH /api/appointments/:id/assign
// @access  Private (Admin)
const assignTechnician = async (req, res) => {
    const { technicianId } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        if (appointment.status === 'Cancelled') {
            res.status(400);
            throw new Error('Cannot assign technician to a cancelled appointment');
        }
        appointment.technician = technicianId;
        appointment.status = 'Assigned';
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private (Admin, Tech)
const updateStatus = async (req, res) => {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        appointment.status = status;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
};

// @desc    Cancel appointment (Customer only, if Pending)
// @route   PATCH /api/appointments/:id/cancel
// @access  Private (Customer)
const cancelAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        if (appointment.customer.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to cancel this appointment');
        }

        if (appointment.status !== 'Pending') {
            res.status(400);
            throw new Error('Can only cancel appointments that are in Pending status');
        }

        appointment.status = 'Cancelled';
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
};

module.exports = { bookAppointment, getAppointments, assignTechnician, updateStatus, cancelAppointment };
