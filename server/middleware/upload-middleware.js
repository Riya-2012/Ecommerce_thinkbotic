const multer = require("multer");
const path = require("path");
// Always resolve the uploads path relative to this file
const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, "uploads");
// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// Configure multer for single file upload
const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("img");

// Configure multer for multiple file uploads
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
}).fields([
  { name: "img", maxCount: 1 },
  { name: "colorImages", maxCount: 20 } // Increase maxCount as needed
]);

module.exports = {
  uploadSingle,
  uploadMultiple,
};
