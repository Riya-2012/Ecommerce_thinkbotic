const mongoose = require("mongoose");

const productPageSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  Brand: { type: String, default: "" },
  img: { type: String, default: "" },
  images: [
  {
    imageColor: { type: String, default: "" },
    imageSet: [{ type: String, default: "" }]
  }
],
  descriptions: { type: String, default: "" },
  category: { type: String, default: "" },
  subCategory: { type: String, default: "" },
  price: { type: Number, default: "" },
  priceAlert: { type: String, default: "" },
  oldPrice: { type: Number, default: "" },
  discount: { type: Number, default: "" },
  gst: { type: Number, default: "" },
  stock: { type: Number, default: 0 },
  stockStatus: {
    type: String,
    enum: ["in-stock", "out-of-stock", "few-left"],
    default: "in-stock"
  },

  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  ratingTotal: { type: Number, default: 0 },
  productDescription: { type: String, default: "" },
  specifications: [
    {
      key: { type: String, default: "" },
      value: { type: String, default: "" },
    }
  ],
  warranty: [
    {
      key: { type: String, default: "" },
      value: { type: String, default: "" },
    }
  ],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, default: 0 },
      key: { type: String, default: "" },
      value: { type: String, default: "" },
    }
  ],
  quesAns: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      key: { type: String, default: "" },
      value: { type: String, default: "" },
    }
  ],
  otherinfo: [
    {
      key: { type: String, default: "" },
      value: { type: String, default: "" },
    }
  ],
  offers: [
    {
      key: { type: String, default: "" },
      value: { type: String, default: "" },
    }
  ],
  otherinfoText: { type: String, default: "" },
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  metaKeywords: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("ProductPage", productPageSchema);
