const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary.config");
const upload = multer({ storage });

const {
  uploadAnnualReport,
  getAllAnnualReports,
} = require("../controllers/annual-report.controller");

// Route: Upload a new annual report (with PDF upload to Cloudinary)
router.post("/upload", upload.single("pdf"), uploadAnnualReport);

// Route: Get all annual reports with pagination and optional keyword search
router.get("/", getAllAnnualReports);

module.exports = router;
