const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    type: [String], // Array of strings for dynamic details
    required: true,
  },
});

module.exports = mongoose.model("Footer", footerSchema);
