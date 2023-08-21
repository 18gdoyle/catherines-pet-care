const mongoose = require('mongoose');

const pendingGreetAppointmentScheme = new mongoose.Schema({
    email: String,
    address: String,
    firstName: String,
    lastName: String,
    appointments: [String],
    cell: String,
});

const PendingGreetAppointment = mongoose.model('pending-greet-appointments', pendingGreetAppointmentScheme);

module.exports = {
    PendingGreetAppointment
}
