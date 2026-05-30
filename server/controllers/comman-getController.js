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
      const page= Number(req.query.page)|| 1;
const limit= Number(req.query.limit) || 10;
const skip=(page-1)*limit;
    const data = await Model.find({}).skip(skip)
      .limit(limit);
      const totalDocuments =await Model.countDocuments();
      const totalPages = Math.ceil(totalDocuments / limit);
    return res.status(200).json({
      success: true,
      message: data.length === 0 ? `No ${modelName} found` : `${modelName} fetched successfully`,
      data,
      totalPages,
      currentPage: page,
      totalDocuments
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
    const topRatedProducts = await ProductPage.find({}).sort({ rating: -1 }).limit(4); 
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


const createInquiry =
async (req, res) => {

  try {

    let {

      name,

      email,

      mobile,

      altMobile,

      quantity,

      description,

      isBulkOrder,

      isCustomization,

    } = req.body;

    // TRIM VALUES

    name =
name?.trim();

    email =
email?.trim().toLowerCase();

    mobile =
mobile?.trim();

    altMobile =
altMobile?.trim();

    description =
description?.trim();

    // REQUIRED FIELDS

    if (

!name ||

!email ||

!mobile ||

!quantity

    ) {

      return res.status(400).json({

success: false,

message:
"Required fields are missing.",
      });
    }

    // NAME VALIDATION

    const nameRegex =
/^[A-Za-z ]+$/;

    if (
!nameRegex.test(name)
    ) {

      return res.status(400).json({

success: false,

message:
"Name should contain only letters",
      });
    }

    if (
name.length < 2
    ) {

      return res.status(400).json({

success: false,

message:
"Name must be at least 2 characters",
      });
    }

    // EMAIL VALIDATION

    const emailRegex =

/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
!emailRegex.test(email)
    ) {

      return res.status(400).json({

success: false,

message:
"Invalid email address",
      });
    }

    // MOBILE VALIDATION

    const mobileRegex =
/^[0-9]{10}$/;

    if (
!mobileRegex.test(mobile)
    ) {

      return res.status(400).json({

success: false,

message:
"Mobile number must be 10 digits",
      });
    }

    // ALT MOBILE VALIDATION

    if (

altMobile &&

!mobileRegex.test(
altMobile
)

    ) {

      return res.status(400).json({

success: false,

message:
"Alternate mobile must be 10 digits",
      });
    }

    // QUANTITY VALIDATION

    quantity =
Number(quantity);

    if (

isNaN(quantity) ||

quantity < 1

    ) {

      return res.status(400).json({

success: false,

message:
"Quantity must be at least 1",
      });
    }

    // DESCRIPTION VALIDATION

    if (

description &&

description.length > 1000

    ) {

      return res.status(400).json({

success: false,

message:
"Description too long",
      });
    }

    // CREATE INQUIRY

    const newInquiry =

new ProductInquiry({

      name,

      email,

      mobile,

      altMobile,

      quantity,

      description,

      isBulkOrder:

isBulkOrder === true ||

isBulkOrder === "true",

      isCustomization:

isCustomization === true ||

isCustomization === "true",
    });

    await newInquiry.save();

    const {
      enquiryNumber
    } = newInquiry;

    // ADMIN EMAIL

    const mailOptionsToAdmin = {

      from:
process.env.EMAIL_USER,

      to:
process.env.RECEIVER_EMAIL,

      subject:

`New Product Inquiry #${enquiryNumber}`,

      text: `

Enquiry No: ${enquiryNumber}

Name: ${name}

Email: ${email}

Mobile: ${mobile}

Alt Mobile: ${altMobile || "-"}

Quantity: ${quantity}

Description: ${description || "-"}

      `,
    };

    // USER EMAIL

    const mailOptionsToUser = {

      from:
process.env.EMAIL_USER,

      to:
email,

      subject:

`Your Inquiry #${enquiryNumber} Received`,

      text: `

Dear ${name},

Thank you for your inquiry (No. ${enquiryNumber}).

Our team will contact you soon.

Best Regards,
Support Team

      `,
    };

    // SEND ADMIN EMAIL

    transporter
.sendMail(mailOptionsToAdmin)

      .then(info =>

console.log(
"Admin mail sent:",
info.response
)

      )

      .catch(err =>

console.error(
"Admin email error:",
err
)

      );

    // SEND USER EMAIL

    transporter
.sendMail(mailOptionsToUser)

      .then(info => {

console.log(
"User mail sent:",
info.response
);

        return res.status(201).json({

success: true,

          enquiryNumber,

message:

"Inquiry submitted successfully.",
        });
      })

      .catch(err => {

console.error(
"User email error:",
err
);

        return res.status(201).json({

success: true,

          enquiryNumber,

message:

"Inquiry saved but user email failed.",
        });
      });

  } catch (err) {

console.error(
"Inquiry submission failed:",
err
);

    // MONGOOSE VALIDATION

    if (
err.name ===
"ValidationError"
    ) {

      const errors =

Object.values(
err.errors
).map(

(error) => error.message
);

      return res.status(400).json({

success: false,

message:
errors[0],
      });
    }

    return res.status(500).json({

success: false,

message:
"Failed to submit inquiry.",
    });
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


const getTopDiscountedProducts =
  async (req, res) => {

    try {

      const products =
        await ProductPage.aggregate([

          {
            $addFields: {

              discount: {

                $round: [

                  {

                    $multiply: [

                      {

                        $divide: [

                          {

                            $subtract: [

                              "$oldPrice",
                              "$price"
                            ]

                          },

                          "$oldPrice"
                        ]
                      },

                      100
                    ]
                  },

                  0
                ]
              }
            }
          },

          // REMOVE INVALID

          {
            $match: {

              oldPrice: {
                $gt: 0
              },

              discount: {
                $gt: 0
              }
            }
          },

          // HIGHEST FIRST

          {
            $sort: {
              discount: -1
            }
          },

          // LIMIT

          {
            $limit: 4
          }

        ]);

      return res.status(200).json({

        success: true,

        data: products,
      });

    } catch (error) {

      console.error(
        "Error fetching top discounted products:",
        error
      );

      return res.status(500).json({

        success: false,

        error:
          "Failed to fetch top discounted products",
      });
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
