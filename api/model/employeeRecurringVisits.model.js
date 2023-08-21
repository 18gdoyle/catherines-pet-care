const mongoose = require('mongoose');

const employeeRecurringVisitsScheme = new mongoose.Schema({
    email: String,
    address: String,
    firstName: String,
    lastName: String,
    cell: String,
    visits: {}
});

const EmployeeRecurringVisits = mongoose.model('employee-recurring-visits', employeeRecurringVisitsScheme);

module.exports = {
    EmployeeRecurringVisits
}
