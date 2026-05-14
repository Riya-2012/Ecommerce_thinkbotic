const ProductPage = require("../models/productPage-model");
const ProductInquiry = require("../models/ProductInquiry-model");

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
        const data = await ProductPage.find({});
        if (!data || data.length === 0) {
            return res.status(404).json({ msg: "No product pages found" });
        }
        return res.status(200).json(data);
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
        const newData = {
            name: req.body.name,
            Brand: req.body.Brand,
            priceAlert: req.body.priceAlert,
            descriptions: req.body.descriptions,
            category: req.body.category,
            subCategory: req.body.subCategory,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            gst: req.body.gst,
            stock: req.body.stock !== undefined ? Number(req.body.stock) : 50,
            stockStatus:
                (req.body.stock !== undefined
                    ? Number(req.body.stock) === 0
                        ? "out-of-stock"
                        : Number(req.body.stock) < 5
                            ? "few-left"
                            : "in-stock"
                    : "in-stock"),
            rating: req.body.rating,
            metaTitle: req.body.metaTitle,
            metaDescription: req.body.metaDescription,
            metaKeywords: req.body.metaKeywords,
            productDescription: req.body.productDescription || "",
            specifications: JSON.parse(req.body.specifications || '[]'),
            warranty: JSON.parse(req.body.warranty || '[]'),
            quesAns: JSON.parse(req.body.quesAns || '[]'),
            otherinfo: JSON.parse(req.body.otherinfo || '[]'),
            offers: JSON.parse(req.body.offers || '[]'),
            otherinfoText: req.body.otherinfoText || "",
        };

        // Main image
        if (req.files && req.files.img && req.files.img[0]) {
            newData.img = `uploads/${req.files.img[0].filename}`;
        } else if (req.body.imgPath && !req.files?.img) {
            newData.img = req.body.imgPath;
        }

        // Color-wise images
        let images = [];
        // colorNames: ["Red", "Blue"]
        // colorImages: [file, file, file, ...] (order must match)
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

            // Group new images by color using colorImageCounts
            let imgIdx = 0;
            colorNames.forEach((color, i) => {
                const count = Number(colorImageCounts[i]) || 0;
                const imageSet = [];

                // Add existing images for this color
                if (existingImagesMap[color]) {
                    imageSet.push(...existingImagesMap[color]);
                }

                // Add new uploaded images for this color (slice instead of loop)
                const newImagesForColor = colorImages.slice(imgIdx, imgIdx + count);
                newImagesForColor.forEach(file => {
                    imageSet.push(`uploads/${file.filename}`);
                });
                imgIdx += count;

                images.push({
                    imageColor: color,
                    imageSet
                });
            });
        }
        else if (req.body.existingColorImages && req.body.colorNames) {
            // Only existing images, no new uploads
            const colorNames = Array.isArray(req.body.colorNames)
                ? req.body.colorNames
                : [req.body.colorNames];
            let flat = Array.isArray(req.body.existingColorImages)
                ? req.body.existingColorImages
                : [req.body.existingColorImages];
            let existingImagesMap = {};
            flat.forEach(item => {
                const obj = typeof item === "string" ? JSON.parse(item) : item;
                if (!obj.color || !obj.image) return;
                if (!existingImagesMap[obj.color]) existingImagesMap[obj.color] = [];
                existingImagesMap[obj.color].push(obj.image);
            });
            images = colorNames.map(color => ({
                imageColor: color,
                imageSet: existingImagesMap[color] || []
            }));
        }
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

        newData.images = images;

        // Save product
        const createdData = new ProductPage(newData);
        await createdData.save();

        return res.status(201).json({
            msg: "Product page created successfully",
            data: createdData
        });

    } catch (error) {
        console.error("Error creating product page:", error);
        return res.status(500).json({
            msg: "Error creating product page",
            error: error.message
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
            "price", "oldPrice", "gst", "metaTitle", "metaDescription", "metaKeywords",
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
