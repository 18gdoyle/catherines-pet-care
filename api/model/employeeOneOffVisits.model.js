const mongoose = require('mongoose');

const employeeOneOffVisitsScheme = new mongoose.Schema({
  email: String,
  address: String,
  firstName: String,
  lastName: String,
  cell: String,
  visits: {}
});

const EmployeeOneOffVisits = mongoose.model('employee-one-off-visits', employeeOneOffVisitsScheme);

module.exports = {
  EmployeeOneOffVisits
}
