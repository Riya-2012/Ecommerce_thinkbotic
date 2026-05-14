// models/ProductInquiry.js
const mongoose = require('mongoose');

// Counter sub‑schema
const counterSchema = new mongoose.Schema({
  _id:    String,
  seq:    { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

// Main inquiry schema
const ProductInquirySchema = new mongoose.Schema({
  enquiryNumber: { type: Number, unique: true },
  name:          { type: String, required: true},
  email:         { type: String, required: true},
  mobile:        { type: String, required: true},
  altMobile:     { type: String, trim: true },
  quantity:      { type: Number, required: true, min: 1 },
  description:   { type: String, trim: true },
  submittedAt:   { type: Date, default: Date.now },
  isBulkOrder:   { type: Boolean, default: false },
  isCustomization: { type: Boolean, default: false },
});

// Pre‑save hook
ProductInquirySchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'ProductInquiry' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.enquiryNumber = counter.seq;
  }
  next();
});

module.exports = mongoose.model('ProductInquiry', ProductInquirySchema);
