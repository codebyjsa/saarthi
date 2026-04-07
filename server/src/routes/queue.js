const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Book Appointment
router.post('/book', protect, async (req, res) => {
  try {
    const { doctorId, department } = req.body;
    const patientId = req.user._id;

    // Check if patient already has an active appointment today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const activeAppointment = await Appointment.findOne({
      patientId,
      status: { $in: ['waiting', 'calling', 'in-progress'] },
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (activeAppointment) {
      return res.status(400).json({ 
        message: 'You already have an active appointment for today', 
        appointment: activeAppointment 
      });
    }

    // Get next token number for this doctor today
    const lastAppointment = await Appointment.findOne({
      doctorId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ tokenNumber: -1 });

    const nextToken = lastAppointment ? lastAppointment.tokenNumber + 1 : 1;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      tokenNumber: nextToken,
      department: department || 'General'
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error during booking' });
  }
});

// Get Live Queue Status for a Doctor
router.get('/status/:doctorId', protect, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({
      doctorId,
      status: { $in: ['waiting', 'calling', 'in-progress'] }
    }).populate('patientId', 'name').sort({ bookedAt: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching queue status' });
  }
});

// Get My Current Appointment
router.get('/my-status', protect, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const appointment = await Appointment.findOne({
      patientId: req.user._id,
      status: { $in: ['waiting', 'calling', 'in-progress'] },
      createdAt: { $gte: startOfDay }
    }).populate('doctorId', 'name');

    if (!appointment) return res.json(null);

    // Get position in queue
    const position = await Appointment.countDocuments({
      doctorId: appointment.doctorId,
      status: 'waiting',
      bookedAt: { $lt: appointment.bookedAt }
    }) + 1;

    res.json({ ...appointment._doc, position });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching my status' });
  }
});

// Mark Appointment as Present (QR Scan or Manual)
router.patch('/present/:id', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isPresent: true },
      { new: true }
    ).populate('patientId', 'name');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating presence' });
  }
});

module.exports = router;
