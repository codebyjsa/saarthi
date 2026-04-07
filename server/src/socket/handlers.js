const Appointment = require('../models/Record'); // Note: Make sure it's the right model
const AppointmentModel = require('../models/Appointment');

const vitalsIntervals = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to socket:', socket.id);

    socket.on('join-doctor-room', (doctorId) => {
      socket.join(doctorId);
      console.log(`Socket ${socket.id} joined room: ${doctorId}`);
      
      // Start vitals simulation if not already running for this doctor
      if (!vitalsIntervals[doctorId]) {
        vitalsIntervals[doctorId] = setInterval(async () => {
          try {
            // Find the active patient for this doctor
            const activeAppointment = await AppointmentModel.findOne({
              doctorId,
              status: 'in-progress'
            }).populate('patientId', 'name');

            if (activeAppointment) {
              const vitals = {
                heartRate: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
                spo2: Math.floor(Math.random() * (99 - 95 + 1)) + 95,
                bp_sys: Math.floor(Math.random() * (130 - 110 + 1)) + 110,
                bp_dia: Math.floor(Math.random() * (85 - 70 + 1)) + 70,
                temp: (Math.random() * (99.2 - 97.8) + 97.8).toFixed(1),
                timestamp: new Date()
              };
              
              io.to(doctorId).emit('vitals-feed', {
                appointmentId: activeAppointment._id,
                vitals
              });
            }
          } catch (err) {
            console.error('Vitals simulation error:', err);
          }
        }, 3000); // Update every 3 seconds
      }
    });

    socket.on('join-patient-room', (patientId) => {
      socket.join(patientId);
      console.log(`Socket ${socket.id} joined patient room: ${patientId}`);
    });

    socket.on('call-next', async ({ doctorId }) => {
      try {
        const nextAppointment = await AppointmentModel.findOneAndUpdate(
          { doctorId, status: 'waiting', isPresent: true }, // Only present patients
          { status: 'calling' },
          { new: true, sort: { tokenNumber: 1 } }
        ).populate('patientId', 'name');

        if (nextAppointment) {
          io.to(doctorId).emit('queue-update');
          io.to(nextAppointment.patientId._id.toString()).emit('my-status-update', nextAppointment);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('start-visit', async ({ appointmentId, doctorId }) => {
      try {
        const appointment = await AppointmentModel.findByIdAndUpdate(
          appointmentId,
          { status: 'in-progress' },
          { new: true }
        ).populate('patientId', 'name');

        if (appointment) {
          io.to(doctorId).emit('queue-update');
          io.to(appointment.patientId._id.toString()).emit('my-status-update', appointment);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('complete-visit', async ({ appointmentId, doctorId }) => {
      try {
        await AppointmentModel.findByIdAndUpdate(appointmentId, { status: 'completed' });
        io.to(doctorId).emit('queue-update');
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('skip-patient', async ({ appointmentId, doctorId }) => {
      try {
        await AppointmentModel.findByIdAndUpdate(appointmentId, { status: 'skipped' });
        io.to(doctorId).emit('queue-update');
      } catch (err) {
        console.error(err);
      }
    });

    // Handle Manual Emergency Simulation (for demo)
    socket.on('trigger-emergency', ({ doctorId, patientId }) => {
       const emergencyVitals = {
          heartRate: 155,
          spo2: 88,
          bp_sys: 190,
          bp_dia: 110,
          temp: 102.4,
          timestamp: new Date(),
          isCritical: true
       };
       io.to(doctorId).emit('vitals-feed', { patientId, vitals: emergencyVitals });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Optional: Cleanup intervals if no one is in the doctor room
    });
  });
};
