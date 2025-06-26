// controllers/dashboardController.js
const dashboardModel = require("../models/dashboard.model");

const getSdgRecords = async (req, res) => {
  const { campus_id, year } = req.params;
  console.log(req.params);

  if (!campus_id || !year) {
    return res.status(400).json({ message: "campus_id and year are required" });
  }

  try {
    const data = await dashboardModel.getSdgRecordValues(
      parseInt(campus_id),
      parseInt(year)
    );
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching SDG records:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSdgScores = async (req, res) => {
  const { campus_id, year } = req.params;
  console.log(req.params);

  if (!campus_id || !year) {
    return res.status(400).json({ message: "user_id and year are required" });
  }

  try {
    const data = await dashboardModel.getSdgRecordScores(
      parseInt(campus_id),
      parseInt(year)
    );
    res.json({ success: "true", data });
  } catch (err) {
    console.error("Error fetching SDG scores:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchCampusIdByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // or req.body.userId if POST
    const campusId = await getCampusIdByUserId(userId);

    if (!campusId) {
      return res
        .status(404)
        .json({ message: "Campus not found for this user." });
    }

    res.json({ campus_id: campusId });
  } catch (err) {
    console.error("Error fetching campus_id:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getAllCampusSdgScores = async (req, res) => {
  const { year, sdg_id } = req.params;

  if (!year) {
    return res.status(400).json({ message: "Year is required" });
  }

  try {
    const data = await dashboardModel.getAllCampusSdgRecordScores(
      parseInt(year),
      parseInt(sdg_id)
    );
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching SDG scores for all campuses:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getSdgRecords,
  getSdgScores,
  getAllCampusSdgScores,
  fetchCampusIdByUserId,
};
