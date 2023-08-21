const mongoose = require('mongoose');

const recurringVisitsScheme = new mongoose.Schema({
    email: String,
    address: String,
    firstName: String,
    lastName: String,
    cell: String,
    visits: {}
});

const RecurringVisits = mongoose.model('recurring-visits', recurringVisitsScheme);

module.exports = {
    RecurringVisits
}
