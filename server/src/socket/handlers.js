const Appointment = require('../models/Appointment');

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Join a specific room (e.g., doctor's department or doctorId)
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Doctor calls the next patient
    socket.on('call-next', async ({ doctorId }) => {
      try {
        // Find the next waiting patient
        const nextPatient = await Appointment.findOneAndUpdate(
          { doctorId, status: 'waiting' },
          { status: 'calling', startedAt: new Date() },
          { sort: { bookedAt: 1 }, new: true }
        ).populate('patientId', 'name');

        if (nextPatient) {
          // Notify everyone in the doctor's room
          io.to(doctorId.toString()).emit('queue-update', {
            type: 'CALLING',
            appointment: nextPatient
          });
        }
      } catch (error) {
        console.error('Error calling next patient:', error);
      }
    });

    // Doctor starts the visit (in-progress)
    socket.on('start-visit', async ({ appointmentId, doctorId }) => {
      try {
        const appointment = await Appointment.findByIdAndUpdate(
          appointmentId,
          { status: 'in-progress' },
          { new: true }
        ).populate('patientId', 'name');

        io.to(doctorId.toString()).emit('queue-update', {
          type: 'IN_PROGRESS',
          appointment
        });
      } catch (error) {
        console.error('Error starting visit:', error);
      }
    });

    // Doctor completes the visit
    socket.on('complete-visit', async ({ appointmentId, doctorId }) => {
      try {
        const appointment = await Appointment.findByIdAndUpdate(
          appointmentId,
          { status: 'completed', completedAt: new Date() },
          { new: true }
        ).populate('patientId', 'name');

        io.to(doctorId.toString()).emit('queue-update', {
          type: 'COMPLETED',
          appointment
        });
      } catch (error) {
        console.error('Error completing visit:', error);
      }
    });

    // Doctor skips the patient
    socket.on('skip-patient', async ({ appointmentId, doctorId }) => {
      try {
        const appointment = await Appointment.findByIdAndUpdate(
          appointmentId,
          { status: 'skipped' },
          { new: true }
        ).populate('patientId', 'name');

        io.to(doctorId.toString()).emit('queue-update', {
          type: 'SKIPPED',
          appointment
        });
      } catch (error) {
        console.error('Error skipping patient:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

module.exports = socketHandlers;
