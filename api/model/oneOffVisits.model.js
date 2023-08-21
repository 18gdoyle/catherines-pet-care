const mongoose = require('mongoose');

const oneOffVisitsScheme = new mongoose.Schema({
    email: String,
    address: String,
    firstName: String,
    lastName: String,
    cell: String,
    visits: {}
});

const OneOffVisits = mongoose.model('one-off-visits', oneOffVisitsScheme);

module.exports = {
    OneOffVisits
}
