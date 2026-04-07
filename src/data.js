// Mock data for the entire application

export const doctors = [
  { id: 1, name: 'Dr. Anika Sharma', specialty: 'Cardiology', avatar: 'AS', status: 'available', patientsToday: 12, rating: 4.9 },
  { id: 2, name: 'Dr. Rajesh Patel', specialty: 'Neurology', avatar: 'RP', status: 'busy', patientsToday: 8, rating: 4.8 },
  { id: 3, name: 'Dr. Priya Mehta', specialty: 'Orthopedics', avatar: 'PM', status: 'available', patientsToday: 15, rating: 4.7 },
  { id: 4, name: 'Dr. Vikram Singh', specialty: 'Pediatrics', avatar: 'VS', status: 'away', patientsToday: 10, rating: 4.9 },
  { id: 5, name: 'Dr. Sunita Reddy', specialty: 'Dermatology', avatar: 'SR', status: 'available', patientsToday: 6, rating: 4.6 },
  { id: 6, name: 'Dr. Arjun Nair', specialty: 'General Medicine', avatar: 'AN', status: 'busy', patientsToday: 20, rating: 4.8 },
];

export const patients = [
  { id: 1, name: 'Aarav Kumar', age: 34, gender: 'Male', phone: '+91 98765 43210', bloodGroup: 'O+', condition: 'Chest Pain', priority: 'high', avatar: 'AK' },
  { id: 2, name: 'Meera Joshi', age: 28, gender: 'Female', phone: '+91 98765 43211', bloodGroup: 'A+', condition: 'Migraine', priority: 'medium', avatar: 'MJ' },
  { id: 3, name: 'Rahul Verma', age: 45, gender: 'Male', phone: '+91 98765 43212', bloodGroup: 'B+', condition: 'Fracture', priority: 'high', avatar: 'RV' },
  { id: 4, name: 'Sanya Gupta', age: 22, gender: 'Female', phone: '+91 98765 43213', bloodGroup: 'AB-', condition: 'Skin Rash', priority: 'low', avatar: 'SG' },
  { id: 5, name: 'Devesh Tiwari', age: 56, gender: 'Male', phone: '+91 98765 43214', bloodGroup: 'O-', condition: 'Diabetes Review', priority: 'medium', avatar: 'DT' },
  { id: 6, name: 'Priyanka Das', age: 31, gender: 'Female', phone: '+91 98765 43215', bloodGroup: 'A-', condition: 'Post-Surgery Follow-up', priority: 'low', avatar: 'PD' },
  { id: 7, name: 'Karan Malhotra', age: 40, gender: 'Male', phone: '+91 98765 43216', bloodGroup: 'B-', condition: 'Hypertension', priority: 'high', avatar: 'KM' },
  { id: 8, name: 'Neha Saxena', age: 29, gender: 'Female', phone: '+91 98765 43217', bloodGroup: 'AB+', condition: 'Fever', priority: 'low', avatar: 'NS' },
];

export const queueData = [
  { position: 1, patientId: 1, tokenNo: 'T-001', estimatedTime: '2 min', status: 'current' },
  { position: 2, patientId: 2, tokenNo: 'T-002', estimatedTime: '12 min', status: 'waiting' },
  { position: 3, patientId: 3, tokenNo: 'T-003', estimatedTime: '22 min', status: 'waiting' },
  { position: 4, patientId: 4, tokenNo: 'T-004', estimatedTime: '32 min', status: 'waiting' },
  { position: 5, patientId: 5, tokenNo: 'T-005', estimatedTime: '42 min', status: 'waiting' },
  { position: 6, patientId: 6, tokenNo: 'T-006', estimatedTime: '52 min', status: 'waiting' },
  { position: 7, patientId: 7, tokenNo: 'T-007', estimatedTime: '62 min', status: 'waiting' },
  { position: 8, patientId: 8, tokenNo: 'T-008', estimatedTime: '72 min', status: 'waiting' },
];

export const appointments = [
  { id: 1, patientId: 2, doctorId: 2, date: '2026-03-25', time: '10:00 AM', type: 'Consultation', status: 'confirmed' },
  { id: 2, patientId: 4, doctorId: 5, date: '2026-03-25', time: '11:30 AM', type: 'Follow-up', status: 'confirmed' },
  { id: 3, patientId: 1, doctorId: 1, date: '2026-03-25', time: '02:00 PM', type: 'Check-up', status: 'pending' },
  { id: 4, patientId: 6, doctorId: 3, date: '2026-03-26', time: '09:00 AM', type: 'Consultation', status: 'confirmed' },
  { id: 5, patientId: 3, doctorId: 3, date: '2026-03-26', time: '03:30 PM', type: 'Surgery Review', status: 'pending' },
];

export const healthRecords = [
  { id: 1, patientId: 1, type: 'Visit', date: '2026-03-20', doctor: 'Dr. Anika Sharma', summary: 'Routine cardiac check-up. ECG normal.', department: 'Cardiology' },
  { id: 2, patientId: 1, type: 'Prescription', date: '2026-03-20', doctor: 'Dr. Anika Sharma', summary: 'Aspirin 75mg daily, Atorvastatin 10mg', department: 'Cardiology' },
  { id: 3, patientId: 1, type: 'Report', date: '2026-03-18', doctor: 'Dr. Anika Sharma', summary: 'Blood work - Lipid panel within normal range', department: 'Pathology', fileType: 'PDF' },
  { id: 4, patientId: 1, type: 'Visit', date: '2026-03-10', doctor: 'Dr. Rajesh Patel', summary: 'Neurological assessment - no anomalies', department: 'Neurology' },
  { id: 5, patientId: 1, type: 'Report', date: '2026-03-05', doctor: 'Dr. Priya Mehta', summary: 'X-Ray Report - Right knee joint normal', department: 'Radiology', fileType: 'PDF' },
  { id: 6, patientId: 1, type: 'Prescription', date: '2026-02-28', doctor: 'Dr. Arjun Nair', summary: 'Paracetamol 500mg, Cetirizine 10mg PRN', department: 'General Medicine' },
  { id: 7, patientId: 1, type: 'Visit', date: '2026-02-15', doctor: 'Dr. Anika Sharma', summary: 'Follow-up visit. Blood pressure stable at 130/85.', department: 'Cardiology' },
];

export const vitalSigns = {
  heartRate: { value: 72, unit: 'bpm', min: 60, max: 100, status: 'normal' },
  bloodPressure: { systolic: 120, diastolic: 80, unit: 'mmHg', status: 'normal' },
  oxygenSaturation: { value: 98, unit: '%', min: 95, max: 100, status: 'normal' },
  temperature: { value: 98.6, unit: '°F', min: 97, max: 99.5, status: 'normal' },
  respiratoryRate: { value: 16, unit: '/min', min: 12, max: 20, status: 'normal' },
};

export const notifications = [
  { id: 1, type: 'alert', title: 'Critical: ICU Bed 3', message: 'Patient oxygen level dropped below 90%', time: '2 min ago', read: false },
  { id: 2, type: 'queue', title: 'Queue Update', message: 'Patient T-001 is now being attended', time: '5 min ago', read: false },
  { id: 3, type: 'appointment', title: 'Appointment Confirmed', message: 'Dr. Sharma confirmed appointment at 2:00 PM', time: '10 min ago', read: false },
  { id: 4, type: 'system', title: 'System Update', message: 'New health records module deployed', time: '30 min ago', read: true },
  { id: 5, type: 'sms', title: 'SMS Sent', message: 'Appointment reminder sent to Aarav Kumar', time: '1 hr ago', read: true },
  { id: 6, type: 'alert', title: 'High BP Alert', message: 'Patient Karan Malhotra BP reading: 160/100', time: '1 hr ago', read: true },
];

export const adminStats = {
  totalPatients: 1284,
  activeQueue: 23,
  avgWaitTime: 18,
  bedsOccupied: 142,
  totalBeds: 200,
  doctorsOnDuty: 12,
  emergencyCases: 3,
  satisfactionRate: 94,
};

// Hourly patient flow data for charts
export const patientFlowData = [
  { hour: '6AM', patients: 5 },
  { hour: '7AM', patients: 12 },
  { hour: '8AM', patients: 25 },
  { hour: '9AM', patients: 42 },
  { hour: '10AM', patients: 55 },
  { hour: '11AM', patients: 48 },
  { hour: '12PM', patients: 35 },
  { hour: '1PM', patients: 28 },
  { hour: '2PM', patients: 40 },
  { hour: '3PM', patients: 52 },
  { hour: '4PM', patients: 45 },
  { hour: '5PM', patients: 30 },
  { hour: '6PM', patients: 18 },
  { hour: '7PM', patients: 10 },
];

export const queueLoadData = [
  { dept: 'Cardiology', load: 85 },
  { dept: 'Neurology', load: 62 },
  { dept: 'Orthopedics', load: 90 },
  { dept: 'Pediatrics', load: 45 },
  { dept: 'Dermatology', load: 30 },
  { dept: 'General', load: 95 },
];
