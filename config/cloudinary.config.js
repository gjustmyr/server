const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "annual-reports",
    resource_type: "raw", // for PDF
    format: async () => "pdf",
    type: "upload", // ← ✅ Ensures public access
  },
});

module.exports = { cloudinary, storage };
