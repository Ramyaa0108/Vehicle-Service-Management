const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    model: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Car', 'Bike', 'Truck', 'Other']
    }
}, {
    timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
