const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    shippingAddress: { type: Object, required: true },
    billingAddress: { type: Object, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductPage" },
        name: String,
        price: Number,
        quantity: Number,
        img: String,
        oldPrice: Number,
        description: String,
        imageColor: String, // <-- ADD THIS LINE
    }],
    orderSummary: { type: Object }, // e.g. itemCount, etc.
    payment: {
        status: { type: String, default: "pending" },
        razorpayPaymentId: String,
        razorpayOrderId: String,
        razorpaySignature: String,
        amount: Number,
        method: String,
        // 👇 Add these two fields:
        pricingDetails: [
            {
                label: String,
                value: Number
            }
        ],
        appliedCoupon: {
            type: Object,
            default: null
        }
    },
    deliveredAt: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);