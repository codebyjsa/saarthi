const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'calling', 'in-progress', 'completed', 'skipped', 'cancelled'],
    default: 'waiting',
  },
  department: {
    type: String,
    default: 'General',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: Date,
  completedAt: Date,
}, { timestamps: true });

// Index for performance
appointmentSchema.index({ doctorId: 1, status: 1, bookedAt: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
