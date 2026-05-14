const { Category, Banner, Cards, TRBanner } = require("../models/landingpage-model");
const Navbar = require("../models/navbar-model");
const Footer = require("../models/footer-model");
const ProductPage = require("../models/productPage-model");
const ProductInquiry = require('../models/ProductInquiry-model');
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Generic function for fetching all records
const getAll = (Model, modelName) => async (req, res) => {
  try {
    const data = await Model.find({});
    return res.status(200).json({
      success: true,
      message: data.length === 0 ? `No ${modelName} found` : `${modelName} fetched successfully`,
      data,
    });
  } catch (error) {
    console.error(`Error fetching ${modelName}:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch ${modelName}`,
      error: error.message,
      data: [],
    });
  }
};

const getProductDetails = async (req, res) => {
  const { productId } = req.params;
  try {
    // Increment views
    await ProductPage.findByIdAndUpdate(productId, { $inc: { views: 1 } });

    const productDetails = await ProductPage.findById(productId)

  .populate(
    "reviews.userId",
    "firstname lastname username email"
  );
    if (!productDetails) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Fetch related products based on the same category
    const relatedProducts = await ProductPage.find({
      category: productDetails.category,
      _id: { $ne: productId } // Exclude the current product
    }).limit(10); // Limit to 10 related products

    return res.status(200).json({ productDetails, relatedProducts });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return res.status(500).json({ error: "Failed to fetch product details" });
  }
};


const getTopRatedProducts = async (req, res) => {
  try {
    const topRatedProducts = await ProductPage.find({}).sort({ rating: -1 }).limit(4); // Fetch top 4 rated products
    if (!topRatedProducts || topRatedProducts.length === 0) {
      return res.status(404).json({ msg: "No top-rated products found" });
    }
    return res.status(200).json(topRatedProducts);
  } catch (error) {
    console.error("Error fetching top-rated products:", error);
    return res.status(500).json({ error: "Failed to fetch top-rated products" });
  }
};

// Nodemailer transporter (with pooling)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

const createInquiry = async (req, res) => {
  const { name, email, mobile, altMobile, quantity, description, isBulkOrder, isCustomization } = req.body;

  if (!name || !email || !mobile || !quantity) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields are missing." });
  }

  try {
    // Boolean conversion for checkboxes
    const newInquiry = new ProductInquiry({
      name,
      email,
      mobile,
      altMobile,
      quantity,
      description,
      isBulkOrder: isBulkOrder === true || isBulkOrder === "true",
      isCustomization: isCustomization === true || isCustomization === "true",
    });
    await newInquiry.save();

    const { enquiryNumber } = newInquiry;

    // 3️⃣ Prepare emails
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Product Inquiry #${enquiryNumber}`,
      text: `
         Enquiry No: ${enquiryNumber}
         Name:       ${name}
         Email:      ${email}
         Mobile:     ${mobile}
         Alt Mobile: ${altMobile || "-"}
         Quantity:   ${quantity}
         Description:${description || "-"}
      `,
    };

    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your Inquiry #${enquiryNumber} Received`,
      text: `Dear ${name},

            Thank you for your inquiry (No. ${enquiryNumber}). Our team will reach out to you soon.

          Best Regards,
          Support Team
      `,
    };

    // 4️⃣ Send admin email
    transporter.sendMail(mailOptionsToAdmin)
      .then(info => console.log("Admin mail sent:", info.response))
      .catch(err => console.error("Admin email error:", err));

    // 5️⃣ Send user email
    transporter.sendMail(mailOptionsToUser)
      .then(info => {
        console.log("User mail sent:", info.response);
        // 6️⃣ Send final response once both mails have at least been queued
        return res.status(201).json({
          success: true,
          enquiryNumber,
          message: "Inquiry submitted and confirmation email sent.",
        });
      })
      .catch(err => {
        console.error("User email error:", err);
        return res.status(201).json({
          success: true,
          enquiryNumber,
          message:
            "Inquiry saved and admin notified, but confirmation email to user failed.",
        });
      });

  } catch (err) {
    console.error("Inquiry submission failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to submit inquiry." });
  }
};


const getProductCards = async (req, res) => {
  try {
    const data = await ProductPage.aggregate([
      {
        $sort: { category: 1, rating: -1 }
      },
      {
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          products: { $slice: ["$products", 2] }
        }
      },
      { $unwind: "$products" },
      { $replaceRoot: { newRoot: "$products" } }
    ]);
    return res.status(200).json({
      success: true,
      message: data.length === 0 ? "No products found" : "products fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
      data: [],
    });
  }
};

const getTopDiscountedProducts = async (req, res) => {
  try {
    const products = await ProductPage.aggregate([
      {
        $addFields: {
          discount: { $subtract: ["$oldPrice", "$price"] }
        }
      },
      { $sort: { discount: -1 } },
      { $limit: 4 }
    ]);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching top discounted products:", error);
    return res.status(500).json({ error: "Failed to fetch top discounted products" });
  }
};


// Exporting controllers
module.exports = {
  getCategories: getAll(Category, "categories"),
  getBanners: getAll(Banner, "banners"),
  getCards: getAll(Cards, "cards"),
  getTRBanner: getAll(TRBanner, "trbanners"),
  getNavbar: getAll(Navbar, "navbar items"),
  getFooter: getAll(Footer, "footer"),
  getProductPage: getAll(ProductPage, "productPages"),

  getProductCards,
  getProductDetails,
  getTopRatedProducts,
  createInquiry,
  getTopDiscountedProducts,
};
