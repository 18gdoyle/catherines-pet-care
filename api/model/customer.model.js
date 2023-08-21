const mongoose = require('mongoose');

const customerScheme = new mongoose.Schema({
    email: String,
    address: String,
    firstName: String,
    lastName: String,
    approved: Boolean,
    cell: String,
});

const Customer = mongoose.model('customers', customerScheme);

module.exports = {
    Customer
}
