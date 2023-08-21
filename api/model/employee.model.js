const mongoose = require('mongoose');

const employeeScheme = new mongoose.Schema({
    email: String,
    address: String,
    firstName: String,
    lastName: String,
});

const Employee = mongoose.model('employees', employeeScheme);

module.exports = {
    Employee
}
