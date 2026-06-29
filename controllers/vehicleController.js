const Vehicle = require('../models/Vehicle');

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Private (Customer)
const addVehicle = async (req, res) => {
    const { model, number, type } = req.body;

    const vehicleExists = await Vehicle.findOne({ number });

    if (vehicleExists) {
        res.status(400);
        throw new Error('Vehicle with this number already registered');
    }

    const vehicle = await Vehicle.create({
        owner: req.user._id,
        model,
        number,
        type
    });

    if (vehicle) {
        res.status(201).json(vehicle);
    } else {
        res.status(400);
        throw new Error('Invalid vehicle data');
    }
};

// @desc    Get all vehicles (Customer: own, Admin: all)
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res) => {
    let vehicles;
    if (req.user.role === 'Admin') {
        vehicles = await Vehicle.find({}).populate('owner', 'name email');
    } else {
        vehicles = await Vehicle.find({ owner: req.user._id });
    }
    res.json(vehicles);
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
        if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(401);
            throw new Error('Not authorized to update this vehicle');
        }

        vehicle.model = req.body.model || vehicle.model;
        vehicle.number = req.body.number || vehicle.number;
        vehicle.type = req.body.type || vehicle.type;

        const updatedVehicle = await vehicle.save();
        res.json(updatedVehicle);
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
        if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(401);
            throw new Error('Not authorized to delete this vehicle');
        }

        await vehicle.deleteOne();
        res.json({ message: 'Vehicle removed' });
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
};

module.exports = { addVehicle, getVehicles, updateVehicle, deleteVehicle };
