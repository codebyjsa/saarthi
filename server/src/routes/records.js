const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { protect, authorize } = require('../middleware/auth');

// Save a new record
router.post('/upload', protect, async (req, res) => {
  try {
    const { patientId, title, url, type, category, isPublic } = req.body;
    
    const record = await Record.create({
      patientId: patientId || req.user._id,
      uploaderId: req.user._id,
      title,
      url,
      type,
      category,
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error saving record metadata' });
  }
});

// Get My Records (For Patients)
router.get('/my', protect, async (req, res) => {
  try {
    const records = await Record.find({ patientId: req.user._id }).sort({ uploadedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching my records' });
  }
});

// Get Patient History (For Doctors)
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const records = await Record.find({ 
      patientId: req.params.patientId, 
      isPublic: true // Limited to public records as per design
    }).sort({ uploadedAt: -1 });
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient history' });
  }
});

// Delete Record
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    
    // Only patient or uploader can delete
    if (record.patientId.toString() !== req.user._id.toString() && 
        record.uploaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await record.deleteOne();
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record' });
  }
});

module.exports = router;
