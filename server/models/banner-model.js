const mongoose =
require("mongoose");

const bannerSchema =
new mongoose.Schema({

  type: {
    type: String,
    enum: [
      "main",
      "side",
      "trbanner",
    ],
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  subtitle: {
    type: String,
  },

  description: {
    type: String,
  },

  buttonText: {
    type: String,
    default: "Shop Now",
  },

  buttonLink: {
    type: String,
    default: "/products",
  },

  img: {
    type: String,
    required: true,
  },

  priceText: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

}, {
  timestamps: true,
});

module.exports =
mongoose.model(
  "Banners",
  bannerSchema
);