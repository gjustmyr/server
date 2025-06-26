const AnnualReportModel = require("../models/annual-report.model");

const uploadAnnualReport = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        status: "FAILED",
        message: "No file uploaded or file path missing.",
      });
    }

    const file_url = req.file.path;
    const { title, year, uploaded_by } = req.body;

    // Basic validation
    if (!title || !year || !uploaded_by) {
      return res.status(400).json({
        status: "FAILED",
        message: "Missing required fields: title, year, or uploaded_by.",
      });
    }

    const parsedYear = parseInt(year);
    const parsedUserId = parseInt(uploaded_by);

    if (isNaN(parsedYear) || isNaN(parsedUserId)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Year and uploaded_by must be valid numbers.",
      });
    }
    // Insert report
    const report = await AnnualReportModel.insert({
      title,
      year: parsedYear,
      file_url,
      uploaded_by: uploaded_by,
    });

    return res.status(201).json({
      status: "SUCCESS",
      message: "Annual report uploaded successfully",
      data: report,
    });
  } catch (err) {
    console.error("Upload Annual Report Error:", err);
    return res.status(500).json({
      status: "FAILED",
      message: "Server error: " + err.message,
    });
  }
};

const getAllAnnualReports = async (req, res) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const keyword = req.query.keyword || "";

    const reports = await AnnualReportModel.getAllAnnualReports({
      pageNo,
      pageSize,
      keyword,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "Annual reports fetched successfully",
      data: reports,
    });
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      message: err.message,
    });
  }
};

module.exports = {
  uploadAnnualReport,
  getAllAnnualReports,
};
