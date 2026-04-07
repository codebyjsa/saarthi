const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String, // image, pdf
    default: 'image',
  },
  category: {
    type: String,
    enum: ['Report', 'Prescription', 'Scan', 'Lab Result', 'Other'],
    default: 'Report',
  },
  isPublic: {
    type: Boolean,
    default: true, // If true, any doctor can see it during OPD
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Indexing for quick retrieval of patient history
recordSchema.index({ patientId: 1, uploadedAt: -1 });

module.exports = mongoose.model('Record', recordSchema);
