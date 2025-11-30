const multer = require("multer");
const path = require("path");

// Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder inside backend
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "_" + Math.round(Math.random() * 1e9) + ext);
  }
});

// File Filter (optional)
const fileFilter = (req, file, cb) => {
  cb(null, true); // allow all file types
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
