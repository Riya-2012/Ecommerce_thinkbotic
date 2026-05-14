const { Category, Banner, TRBanner } = require("../models/landingpage-model");
const Footer = require("../models/footer-model");
const Cart = require("../models/cart-model");
const ProductPage = require("../models/productPage-model");
const Order = require("../models/order-model");
const path = require("path");
const fs = require("fs");

// Generic function for fetching all records
const getAll = (Model, modelName) => async (req, res, next) => {
  try {
    if (!Model) {
      return res.status(500).json({ msg: `Model for ${modelName} not found` });
    }
    const limit = parseInt(req.query.limit) || 0;
    const data = await Model.find({}).limit(limit);
    // Always return 200, even if no data
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Generic function for fetching a single record by ID
const getById = (Model, modelName) => async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching ${modelName} with ID:`, id); // Debugging line

    const data = await Model.findById(id);
    if (!data) {
      return res.status(404).json({ msg: `${modelName} not found` });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(400)
      .json({ msg: `Error fetching ${modelName}`, error: error.message });
  }
};

// Function to update records by ID with image handling
const updateById = (Model, modelName) => async (req, res, next) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    console.log(`Updating ${modelName} with ID:`, id);

    // Parse stringified fields back into arrays of objects
    // Ensure color and priceAlert are included
    if (req.body.color !== undefined) updateData.color = req.body.color;
    if (req.body.priceAlert !== undefined)
      updateData.priceAlert = req.body.priceAlert;

    if (typeof updateData.specifications === "string") {
      updateData.specifications = JSON.parse(updateData.specifications || "[]");
    }
    if (typeof updateData.productDescription === "string") {
      updateData.productDescription = JSON.parse(
        updateData.productDescription || "[]"
      );
    }
    if (typeof updateData.warranty === "string") {
      updateData.warranty = JSON.parse(updateData.warranty || "[]");
    }
    if (typeof updateData.reviews === "string") {
      updateData.reviews = JSON.parse(updateData.reviews || "[]");
    }
    if (typeof updateData.quesAns === "string") {
      updateData.quesAns = JSON.parse(updateData.quesAns || "[]");
    }
    if (typeof updateData.otherinfo === "string") {
      updateData.otherinfo = JSON.parse(updateData.otherinfo || "[]");
    }
    if (typeof updateData.offers === "string") {
      updateData.offers = JSON.parse(updateData.offers || "[]");
    }
    if (typeof updateData.attributes === "string") {
      updateData.attributes = JSON.parse(updateData.attributes);
    }
    if (typeof updateData.moreAttributes === "string") {
      updateData.moreAttributes = JSON.parse(updateData.moreAttributes);
    }
    if (typeof updateData.packingDelivery === "string") {
      updateData.packingDelivery = JSON.parse(updateData.packingDelivery);
    }
    if (typeof updateData.productDetails === "string") {
      updateData.productDetails = JSON.parse(updateData.productDetails);
    }

    if (req.file) {
      const existingRecord = await Model.findById(id);
      if (!existingRecord) {
        return res.status(404).json({ msg: `${modelName} not found` });
      }

      if (existingRecord.img) {
        const oldImagePath = path.join(__dirname, "../", existingRecord.img);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.img = `uploads/${req.file.filename}`;
    } else {
      const existingRecord = await Model.findById(id);
      if (existingRecord && existingRecord.img) {
        updateData.img = existingRecord.img;
      }
    }

    const updatedData = await Model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      return res.status(404).json({ msg: `${modelName} not found` });
    }

    return res
      .status(200)
      .json({ msg: `${modelName} updated successfully`, data: updatedData });
  } catch (error) {
    console.error(`Error updating ${modelName}:`, error); 
    return res
      .status(400)
      .json({ msg: `Error updating ${modelName}`, error: error.message });
  }
};

// Function to delete record by ID
const deleteById = (Model, modelName) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Model.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ msg: `${modelName} not found` });
    }
    return res.status(200).json({ msg: `${modelName} deleted successfully` });
  } catch (error) {
    next(error);
  }
};

// Function to create a record
const create = (Model, modelName) => async (req, res, next) => {
  try {
    const {
      name,
      category,
      color,
      price,
      oldPrice,
      title,
      items,
      details,
      specifications,
      rating,
      attributes,
      moreAttributes,
      packingDelivery,
      productDetails,
      description,
    } = req.body;
    const img = req.file ? `uploads/${req.file.filename}` : null;

    // Parse stringified fields back into arrays of objects
    const parsedSpecifications = specifications
      ? JSON.parse(specifications)
      : [];
    const parsedAttributes = attributes ? JSON.parse(attributes) : [];
    const parsedMoreAttributes = moreAttributes
      ? JSON.parse(moreAttributes)
      : [];
    const parsedPackingDelivery = packingDelivery
      ? JSON.parse(packingDelivery)
      : [];
    const parsedProductDetails = productDetails
      ? JSON.parse(productDetails)
      : [];

    let newData;
    if (
      modelName.toLowerCase() === "product card" ||
      modelName.toLowerCase() === "productpage"
    ) {
      newData = new Model({
        name,
        color,
        priceAlert,
        category,
        price,
        oldPrice,
        specifications: parsedSpecifications,
        attributes: parsedAttributes,
        moreAttributes: parsedMoreAttributes,
        packingDelivery: parsedPackingDelivery,
        productDetails: parsedProductDetails,
        img,
      });
    }
    if (modelName.toLowerCase() === "category") {
      if (!category || !img) {
        console.error("Missing fields:", { category, img }); // Add this line
        return res
          .status(400)
          .json({
            msg: "All fields (category, img) are required for category page",
          });
      }
      newData = new Model({ category, img });
    } else if (modelName.toLowerCase() === "banner") {
      if (!name || !img) {
        return res.status(400).json({ msg: "Name and image are required" });
      }
      newData = new Model({ name, img });
    } else if (modelName.toLowerCase() === "trbanner") {
      if (!category || !img) {
        return res.status(400).json({ msg: "Category and image are required" });
      }
      newData = new Model({ category, img });
    } else if (modelName.toLowerCase() === "footer") {
      let parsedDetails = details;
      if (typeof details === "string") {
        parsedDetails = JSON.parse(details);
      }
      if (!title || !description || !parsedDetails) {
        return res
          .status(400)
          .json({ msg: "Title, description, and details are required" });
      }
      newData = new Model({ title, description, details: parsedDetails });
    }

    await newData.save();
    return res
      .status(201)
      .json({ msg: `${modelName} created successfully`, data: newData });
  } catch (error) {
    next(error);
  }
};

// Get count of confirmed orders in last 7 days
const getRecentConfirmedOrdersCount = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const count = await Order.countDocuments({
      "payment.status": "success",
      createdAt: { $gte: oneWeekAgo },
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent orders count" });
  }
};

const getTotalSale = async (req, res) => {
  try {
    const orders = await Order.find({ "payment.status": "success" });
    const totalSale = orders.reduce(
      (sum, order) => sum + (order.payment.amount || 0),
      0
    );
    res.json({ totalSale });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch total sale" });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update delivery status" });
  }
};

const cartNotification = async (req, res) => {
  try {
    // Cart ko user ki details ke saath fetch karo
    const carts = await Cart.find({
      "items.addedAt": { $lte: new Date(Date.now() -3 * 24 * 60 * 60 * 1000) }
    }).populate("userId", "email phone"); 

    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart notifications" });
  }
};

// Exporting specific controllers using generic functions
module.exports = {
  getAllCategories: getAll(Category, "category"),
  getAllBanners: getAll(Banner, "banner"),
  findCategoryById: getById(Category, "category"),
  findBannerById: getById(Banner, "banner"),
  updateCategoryById: updateById(Category, "category"),
  updateBannerById: updateById(Banner, "banner"),
  deleteCategoryById: deleteById(Category, "category"),
  deleteBannerById: deleteById(Banner, "banner"),
  createCategory: create(Category, "category"),
  createBanner: create(Banner, "banner"),

  getAllTRBanner: getAll(TRBanner, "trbanner"),
  findTRBannerById: getById(TRBanner, "trbanner"),
  updateTRBannerById: updateById(TRBanner, "trbanner"),
  deleteTRBannerById: deleteById(TRBanner, "trbanner"),
  createTRBanner: create(TRBanner, "trbanner"),

  getAllFooter: getAll(Footer, "footer"),
  findFooterById: getById(Footer, "footer"),
  updateFooterById: updateById(Footer, "footer"),
  deleteFooterById: deleteById(Footer, "footer"),
  createFooter: create(Footer, "footer"),

  getAllCarts: getAll(Cart, "cart"),
  getCart: getById(Cart, "cart"),
  updateCartById: updateById(Cart, "cart"),
  deleteCartById: deleteById(Cart, "cart"),

  getAllProductCards: getAll(ProductPage, "product card"),
  getProductCardById: getById(ProductPage, "product card"),
  createProductCard: create(ProductPage, "product card"),
  updateProductCardById: updateById(ProductPage, "product card"),
  deleteProductCardById: deleteById(ProductPage, "product card"),

  getRecentConfirmedOrdersCount,
  getTotalSale,

  markOrderAsDelivered,
  cartNotification
};
