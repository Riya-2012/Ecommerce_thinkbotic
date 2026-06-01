const ProductPage = require("../models/productPage-model");
const ProductInquiry = require("../models/ProductInquiry-model");

const sharp =
require("sharp");

const fs =
require("fs");


// Add this at the top of your file
function safeParse(str) {
    try {
        return JSON.parse(str);
    } catch {
        return [];
    }
}


const getAllProductDetails = async (req, res, next) => {
    try {
        const data = await ProductDetails.find({});
        if (!data || data.length === 0) {
            return res.status(404).json({ msg: "No product details found" });
        }
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getProductInquiry = async (req, res, next) => {
    try {
        const data = await ProductInquiry.find({});
        // Always return 200, even if no data
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getProductInquiryCount = async (req, res, next) => {
    try {
        const count = await ProductInquiry.countDocuments();
        return res.status(200).json({ count });
    } catch (error) {
        next(error);
    }
};

const deleteProductInquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await ProductInquiry.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ msg: "Inquiry not found" });
        }
        return res.status(200).json({ msg: "Inquiry deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const getProductDetailsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await ProductDetails.findById(id);
        if (!data) {
            return res.status(404).json({ msg: "Product details not found" });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ msg: "Error fetching product details", error: error.message });
    }
};

const createProductDetails = async (req, res, next) => {
    try {
        const newData = new ProductDetails(req.body);
        await newData.save();
        return res.status(201).json({ msg: "Product details created successfully", data: newData });
    } catch (error) {
        next(error);
    }
};

const updateProductDetailsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedData = await ProductDetails.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedData) {
            return res.status(404).json({ msg: "Product details not found" });
        }
        return res.status(200).json({ msg: "Product details updated successfully", data: updatedData });
    } catch (error) {
        return res.status(400).json({ msg: "Error updating product details", error: error.message });
    }
};

const deleteProductDetailsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await ProductDetails.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ msg: "Product details not found" });
        }
        return res.status(200).json({ msg: "Product details deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// ProductPage functions
const getAllProductPages = async (req, res, next) => {
    try {
            const page= Number(req.query.page)|| 1;
const limit= Number(req.query.limit) || 5;
const skip=(page-1)*limit;
        const data = await ProductPage.find({}).skip(skip)
      .limit(limit).sort({ createdAt: -1 });
 const totalDocuments =await ProductPage.countDocuments();
 const totalPages = Math.ceil( totalDocuments / limit );
        if (!data || data.length === 0) {
            return res.status(404).json({ msg: "No product pages found" });
        }
        return res.status(200).json({data,totalPages, currentPage: page, totalDocuments });
    } catch (error) {
        next(error);
    }
};

const getProductPageById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await ProductPage.findById(id);
        if (!data) {
            return res.status(404).json({ msg: "Product page not found" });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ msg: "Error fetching product page", error: error.message });
    }
};


const createProductPage = async (req, res, next) => {
  try {

    // ── TRIM STRINGS ──────────────────────────────────────────────────────
    const name              = req.body.name?.trim();
    const Brand             = req.body.Brand?.trim();
    const descriptions      = req.body.descriptions?.trim();
    const category          = req.body.category?.trim();
    const subCategory       = req.body.subCategory?.trim();
    const metaTitle         = req.body.metaTitle?.trim();
    const metaDescription   = req.body.metaDescription?.trim();
    const metaKeywords      = req.body.metaKeywords?.trim();

    // ── SAFE NUMBER CONVERSION ────────────────────────────────────────────
    // Use || 0 so missing / empty-string values become 0, never NaN
    const price    = req.body.price    !== undefined && req.body.price    !== "" ? Number(req.body.price)    : undefined;
    const oldPrice = req.body.oldPrice !== undefined && req.body.oldPrice !== "" ? Number(req.body.oldPrice) : 0;
    const discount = req.body.discount !== undefined && req.body.discount !== "" ? Number(req.body.discount) : 0;
    const gst      = req.body.gst      !== undefined && req.body.gst      !== "" ? Number(req.body.gst)      : 0;
    const stock    = req.body.stock    !== undefined && req.body.stock    !== "" ? Number(req.body.stock)    : 50;
    // rating is set by users via reviews — never trust a value from the admin form
    // default to 0; schema has default:0 so we can simply omit it too
    const rating   = 0;

    // ── REQUIRED VALIDATION ───────────────────────────────────────────────
    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required",
      });
    }

    // NaN guard — catches any edge-case bad numeric input
    if (isNaN(price) || isNaN(oldPrice) || isNaN(discount) || isNaN(gst) || isNaN(stock)) {
      return res.status(400).json({
        success: false,
        message: "Invalid numeric value in price, oldPrice, discount, GST, or stock",
      });
    }

    if (name.length < 2) {
      return res.status(400).json({ success: false, message: "Product name too short" });
    }
    if (price < 0) {
      return res.status(400).json({ success: false, message: "Price cannot be negative" });
    }
    if (oldPrice < 0) {
      return res.status(400).json({ success: false, message: "Old price cannot be negative" });
    }
    if (discount < 0 || discount > 100) {
      return res.status(400).json({ success: false, message: "Discount must be between 0 and 100" });
    }
    if (gst < 0 || gst > 100) {
      return res.status(400).json({ success: false, message: "GST must be between 0 and 100" });
    }
    if (stock < 0) {
      return res.status(400).json({ success: false, message: "Stock cannot be negative" });
    }

    // ── MAIN IMAGE ────────────────────────────────────────────────────────
    if (!req.files?.img && !req.body.imgPath) {
       
// MAIN IMAGE VALIDATION

if (
req.files?.img?.[0]
) {

  const file =
req.files.img[0];

  // FILE TYPE

  const allowedTypes = [

    "image/jpeg",

    "image/jpg",

    "image/png",

    "image/webp",
  ];

  if (

!allowedTypes.includes(
file.mimetype
)

  ) {

    fs.unlinkSync(
file.path
    );

    return res.status(400).json({

      success: false,

      message:
"Only JPG, PNG and WEBP allowed",
    });
  }

  // FILE SIZE

  const maxSize =
5 * 1024 * 1024;

  if (
file.size > maxSize
  ) {

    fs.unlinkSync(
file.path
    );

    return res.status(400).json({

      success: false,

      message:
"Image size must be under 5MB",
    });
  }

  // IMAGE DIMENSIONS

  const metadata =

await sharp(file.path)
.metadata();

  // WIDTH

  if (
metadata.width < 1300
  ) {

    fs.unlinkSync(
file.path
    );

    return res.status(400).json({

      success: false,

      message:
"Image width must be at least 1300px",
    });
  }

  // HEIGHT

  if (
metadata.height < 1000
  ) {

    fs.unlinkSync(
file.path
    );

    return res.status(400).json({

      success: false,

      message:
"Image height must be at least 100px",
    });
  }
    }


      return res.status(400).json({ success: false, message: "Main image is required" });
    }

    // ── PREPARE DATA ──────────────────────────────────────────────────────
    const newData = {
      name,
      Brand,
      descriptions,
      category,
      subCategory,
      price,
      oldPrice,
      discount,
      gst,
      stock,
      rating,                          // always 0 from admin; updated by user reviews
      metaTitle,
      metaDescription,
      metaKeywords,
      priceAlert:         req.body.priceAlert || "",
      stockStatus:        stock === 0 ? "out-of-stock" : stock < 5 ? "few-left" : "in-stock",
      productDescription: req.body.productDescription || "",
      specifications:     JSON.parse(req.body.specifications || "[]"),
      warranty:           JSON.parse(req.body.warranty      || "[]"),
      otherinfo:          JSON.parse(req.body.otherinfo      || "[]"),
      offers:             JSON.parse(req.body.offers         || "[]"),
      otherinfoText:      req.body.otherinfoText || "",
      // reviews and quesAns are managed by users — never set from admin form
      reviews:  [],
      quesAns:  [],
    };

    // ── MAIN IMAGE PATH ───────────────────────────────────────────────────
    if (req.files?.img?.[0]) {
      newData.img = `uploads/${req.files.img[0].filename}`;
    } else if (req.body.imgPath) {
      newData.img = req.body.imgPath;
    }

    // ── COLOR IMAGES ──────────────────────────────────────────────────────
    let images = [];

    if (req.body.colorNames && req.files?.colorImages) {
    
// COLOR IMAGE VALIDATION

for (
const file of req.files.colorImages
) {

  // FILE TYPE

  const allowedTypes = [

    "image/jpeg",

    "image/jpg",

    "image/png",

    "image/webp",
  ];

  if (

!allowedTypes.includes(
file.mimetype
)

  ) {

    fs.unlinkSync(
file.path
    );

    return res.status(400).json({

      success: false,

      message:
"Only JPG, PNG and WEBP allowed",
    });
  }

  // FILE SIZE

  const maxSize =
5 * 1024 * 1024;

  if (
file.size > maxSize
  ) {

    fs.unlinkSync(
file.path
    );

    return res.status(400).json({

      success: false,

      message:
"Color image size must be under 5MB",
    });
  }

  // DIMENSIONS

  const metadata =

await sharp(file.path)
.metadata();

  if (
metadata.width < 500
  ) {

    fs.unlinkSync(
file.path
    );

    return res.status(400).json({

      success: false,

      message:
"Color image width must be at least 500px",
    });
  }

  if (
metadata.height < 500
  ) {

    fs.unlinkSync(
file.path
    );

    return res.status(400).json({

      success: false,

      message:
"Color image height must be at least 500px",
    });
  }
}


      const colorNames = Array.isArray(req.body.colorNames)
        ? req.body.colorNames
        : [req.body.colorNames];

      const colorImages = req.files.colorImages;

      const colorImageCounts = req.body.colorImageCounts
        ? JSON.parse(req.body.colorImageCounts)
        : Array(colorNames.length).fill(1);

      let existingImagesMap = {};
      if (req.body.existingColorImages) {
        const flat = Array.isArray(req.body.existingColorImages)
          ? req.body.existingColorImages
          : [req.body.existingColorImages];

        flat.forEach((item) => {
          const obj = typeof item === "string" ? JSON.parse(item) : item;
          if (!obj.color || !obj.image) return;
          if (!existingImagesMap[obj.color]) existingImagesMap[obj.color] = [];
          existingImagesMap[obj.color].push(obj.image);
        });
      }

      let imgIdx = 0;
      colorNames.forEach((color, i) => {
        const count    = Number(colorImageCounts[i]) || 0;
        const imageSet = [];

        if (existingImagesMap[color]) {
          imageSet.push(...existingImagesMap[color]);
        }

        colorImages.slice(imgIdx, imgIdx + count).forEach((file) => {
          imageSet.push(`uploads/${file.filename}`);
        });

        imgIdx += count;
        images.push({ imageColor: color, imageSet });
      });
    }

    newData.images = images;

    // ── CREATE ────────────────────────────────────────────────────────────
    const createdData = new ProductPage(newData);
    await createdData.save();

    return res.status(201).json({
      success: true,
      message: "Product page created successfully",
      data:    createdData,
    });

  } catch (error) {
    console.error("Error creating product page:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: errors[0] });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating product page",
      error:   error.message,
    });
  }
};




const updateProductPageById = async (req, res, next) => {
    try {
        const { id } = req.params;
        let updateData = {};

        // Copy all simple fields from req.body
        const allowedFields = [
            "name", "Brand", "priceAlert", "descriptions", "category", "subCategory",
            "price", "oldPrice","discount", "gst", "metaTitle", "metaDescription", "metaKeywords",
            "productDescription", "specifications", "warranty", "quesAns", "otherinfo",
            "offers", "otherinfoText"
        ];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                // Parse arrays/objects if needed
                if (["specifications", "warranty", "quesAns", "otherinfo", "offers"].includes(field)) {
                    updateData[field] = safeParse(req.body[field]);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        // Main image
        if (req.files && req.files.img && req.files.img[0]) {

            updateData.img = `uploads/${req.files.img[0].filename}`;
        } else if (req.body.imgPath && !req.files?.img) {
            updateData.img = req.body.imgPath;
        }

        // Color-wise images (existing logic)
        let images = [];
        if (req.body.colorNames && req.files && req.files.colorImages) {
            const colorNames = Array.isArray(req.body.colorNames)
                ? req.body.colorNames
                : [req.body.colorNames];
            const colorImages = req.files.colorImages;

            let colorImageCounts = req.body.colorImageCounts
                ? JSON.parse(req.body.colorImageCounts)
                : Array(colorNames.length).fill(1);

            // Prepare existing images grouped by color
            let existingImagesMap = {};
            if (req.body.existingColorImages) {
                const flat = Array.isArray(req.body.existingColorImages)
                    ? req.body.existingColorImages
                    : [req.body.existingColorImages];
                flat.forEach(item => {
                    const obj = typeof item === "string" ? JSON.parse(item) : item;
                    if (!obj.color || !obj.image) return;
                    if (!existingImagesMap[obj.color]) existingImagesMap[obj.color] = [];
                    existingImagesMap[obj.color].push(obj.image);
                });
            }

            // Group new images by color using colorImageCounts (fixed slicing)
            let imgIdx = 0;
            colorNames.forEach((color, i) => {
                const count = Number(colorImageCounts[i]) || 0;
                const imageSet = [];

                // Add existing images for this color
                if (existingImagesMap[color]) {
                    imageSet.push(...existingImagesMap[color]);
                }

                // Add new uploaded images for this color (slice instead of loop)
                const newImagesForColor = colorImages.slice(imgIdx, imgIdx + (count - (existingImagesMap[color]?.length || 0)));
                newImagesForColor.forEach(file => {
                    imageSet.push(`uploads/${file.filename}`);
                });
                imgIdx += (count - (existingImagesMap[color]?.length || 0));

                images.push({
                    imageColor: color,
                    imageSet
                });
            });
        }
        // If only existing images (no new uploads)
        else if (req.body.existingColorImages && req.body.colorNames) {
            const colorNames = Array.isArray(req.body.colorNames)
                ? req.body.colorNames
                : [req.body.colorNames];
            let flat = Array.isArray(req.body.existingColorImages)
                ? req.body.existingColorImages
                : [req.body.existingColorImages];
            images = colorNames.map(color => ({
                imageColor: color,
                imageSet: flat
                    .map(item => typeof item === "string" ? JSON.parse(item) : item)
                    .filter(obj => obj.color === color && obj.image)
                    .map(obj => obj.image)
            }));
        }
        // Fallback for JSON payload
        else if (req.body.images) {
            if (typeof req.body.images === "string") {
                try {
                    images = JSON.parse(req.body.images);
                } catch {
                    images = [];
                }
            } else if (Array.isArray(req.body.images)) {
                images = req.body.images;
            }
        }

        updateData.images = images;

        // ---- Handle stock status ----
        if (req.body.stock !== undefined) {
            updateData.stock = Number(req.body.stock);
            if (updateData.stock === 0) {
                updateData.stockStatus = "out-of-stock";
            } else if (updateData.stock < 5) {
                updateData.stockStatus = "few-left";
            } else {
                updateData.stockStatus = "in-stock";
            }
        }

        // ---- Update product ----
        const updatedData = await ProductPage.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedData) {
            return res.status(404).json({ msg: "Product page not found" });
        }

        return res
            .status(200)
            .json({ msg: "Product page updated successfully", data: updatedData });
    } catch (error) {
        return res
            .status(400)
            .json({ msg: "Error updating product page", error: error.message });
    }
};


const deleteProductPageById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await ProductPage.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ msg: "Product page not found" });
        }
        return res.status(200).json({ msg: "Product page deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// User submits a question (no answer yet)
const addProductQuestion = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { question } = req.body;
        const userId = req.user._id; // from auth middleware

        if (!question) return res.status(400).json({ msg: "Question is required" });

        const product = await ProductPage.findById(productId);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        product.quesAns.push({ userId, key: question, value: "" });
        await product.save();

        res.status(201).json({ msg: "Question submitted", quesAns: product.quesAns });
    } catch (error) {
        next(error);
    }
};

// Admin answers a question
const answerProductQuestion = async (req, res, next) => {
    try {
        const { productId, qaId } = req.params;
        const { answer } = req.body;

        const product = await ProductPage.findById(productId);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        const qa = product.quesAns.id(qaId);
        if (!qa) return res.status(404).json({ msg: "Q&A not found" });

        qa.value = answer;
        await product.save();

        res.status(200).json({ msg: "Answer added", quesAns: product.quesAns });
    } catch (error) {
        next(error);
    }
};

const deleteProductImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const imageUrl = req.body.imageUrl || req.query.imageUrl;

        console.log("Delete image called for product:", id, "imageUrl:", imageUrl);

        if (!imageUrl) {
            return res.status(400).json({ msg: "Image URL is required" });
        }

        const product = await ProductPage.findById(id);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // Log for debugging
        console.log("Product images before:", product.images);

        // Use decodeURIComponent for safety
        const decodedUrl = decodeURIComponent(imageUrl);

        // Remove image by strict match
        const newImages = (product.images || []).filter(img => img !== decodedUrl);
        if (newImages.length === product.images.length) {
            // Not found
            return res.status(404).json({ msg: "Image not found in product images" });
        }
        product.images = newImages;

        await product.save() ;

        console.log("Product images after:", product.images);

        return res.status(200).json({ msg: "Image deleted", images: product.images });
    } catch (error) {
        console.error("Delete image error:", error);
        return res.status(500).json({ msg: "Error deleting image", error: error.message });
    }
};

module.exports = {
    getAllProductDetails,
    getProductDetailsById,
    createProductDetails,
    updateProductDetailsById,
    deleteProductDetailsById,
    getAllProductPages,
    getProductPageById,
    createProductPage,
    updateProductPageById,
    deleteProductPageById,
    getProductInquiry,
    deleteProductInquiry,
    getProductInquiryCount,

    addProductQuestion,
    answerProductQuestion,

    deleteProductImage,
};
