// middleware/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure an uploads/ folder exists (only needed for diskStorage)
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// • Disk storage just saves the file temporarily before we push to Cloudinary
//   (you can switch to memoryStorage if you prefer)
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

// • Only accept PDFs
const fileFilter = (_, file, cb) =>
  path.extname(file.originalname).toLowerCase() === ".pdf"
    ? cb(null, true)
    : cb(new Error("Only PDF files are allowed"), false);

// • 10 MB limit is typical for reports—tune as needed
const limits = { fileSize: 10 * 1024 * 1024 };

module.exports = multer({ storage, fileFilter, limits });
