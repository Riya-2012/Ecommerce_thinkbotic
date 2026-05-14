const mongoose = require("mongoose");

// Category Schema
const categorySchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
    },
    category:{
        type : String,
        require : true,
    }
});

// Banner Schema
const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
});

//CardBanner schema 
const trBannerSchema = new mongoose.Schema({
    category: { // Add category field
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
});

// Creating Models
const Category = mongoose.model("Category", categorySchema);
const Banner = mongoose.model("Banner", bannerSchema);
const TRBanner = mongoose.model("TRBanner", trBannerSchema);

module.exports = { Category, Banner, TRBanner };
