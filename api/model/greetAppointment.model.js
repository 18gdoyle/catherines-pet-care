const mongoose = require('mongoose');

const greetAppointmentScheme = new mongoose.Schema({
    email: String,
    address: String,
    firstName: String,
    lastName: String,
    appointment: String,
    assignedEmployee: String,
    assignedEmployeeName: String,
    cell: String,
});

const GreetAppointment = mongoose.model('greet-appointments', greetAppointmentScheme);

module.exports = {
    GreetAppointment
}
