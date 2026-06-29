const mongoose = require('mongoose');

const serviceRecordSchema = mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repairsDone: {
        type: String,
        required: true
    },
    partsReplaced: {
        type: String
    },
    maintenanceNotes: {
        type: String
    },
    serviceDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const ServiceRecord = mongoose.model('ServiceRecord', serviceRecordSchema);
module.exports = ServiceRecord;
