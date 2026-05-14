const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: false,
        default: "",
    },
    gst: {
        type: String,
        required: false,
        default: "",
    },
    address: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        required: false,
        default: "",
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    altMobile: {
        type: String,
        required: false,
        default: "",
    },
    type: {
        type: String,
        enum: ['Home', 'Office', 'Shipping', 'Billing'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('userAddress', addressSchema);
