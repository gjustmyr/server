const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

// ✅ Most specific routes first
router.get("/score/:campus_id/:year", dashboardController.getSdgScores);
router.get("/rank/:year/:sdg_id", dashboardController.getAllCampusSdgScores);
router.get("/campus-id/:user_id", dashboardController.fetchCampusIdByUserId); // ✅ NEW ROUTE
router.get("/:campus_id/:year", dashboardController.getSdgRecords); // Generic route goes last

module.exports = router;
