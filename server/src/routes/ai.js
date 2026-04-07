const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect, authorize } = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/suggest', protect, authorize('doctor'), async (req, res) => {
  try {
    const { symptoms, history, vitals } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      You are Saarthi AI, a specialized medical assistant for doctors.
      
      PATIENT DATA:
      - Symptoms: ${symptoms}
      - Vitals: Heart Rate: ${vitals.heartRate} bpm, SpO2: ${vitals.spo2}%, BP: ${vitals.bp_sys}/${vitals.bp_dia} mmHg
      - Medical History (Last Records): ${JSON.stringify(history)}

      TASK:
      Analyze the above data and provide a professional medical suggestion for the doctor.
      Format your response in MARKDOWN with these sections:
      1. **Analysis**: Brief summary of the condition.
      2. **Suggested Tests**: Any diagnostic tests needed.
      3. **Potential Prescription**: List of medications (with placeholder dosages).
      4. **Patient Advice**: Lifestyle or immediate care advice.

      CRITICAL: Include this disclaimer at the bottom: "Disclaimer: This is an AI-generated suggestion for reference only. Final clinical decisions must be made by the licensed physician."
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ suggestion: text });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ message: 'AI Analysis failed. Check API key.' });
  }
});

module.exports = router;
