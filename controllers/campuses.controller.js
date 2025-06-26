const CampusesModel = require("../models/campuses.model");

const CampusesController = {
  getAllCampuses: async (req, res) => {
    try {
      const campuses = await CampusesModel.getAllCampuses(req.query);

      res.status(200).json({
        data: campuses.data,
        message: "Campuses fetched successfully.",
        status: "SUCCESS",
        total: campuses.total,
      });
    } catch (err) {
      res.status(500).json({
        data: [],
        message: "Failed to fetch campuses.",
        status: "FAILED",
      });
    }
  },
  getCampusById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        data: [],
        message: "Campus ID is required.",
        status: "FAILED",
      });
    }

    try {
      const campus = await CampusesModel.getCampusById(id);

      if (!campus) {
        return res.status(404).json({
          data: [],
          message: "Campus not found.",
          status: "FAILED",
        });
      }

      res.status(200).json({
        data: campus,
        message: "Campus fetched successfully.",
        status: "SUCCESS",
      });
    } catch (err) {
      res.status(500).json({
        data: [],
        message: "Failed to fetch campus.",
        status: "FAILED",
      });
    }
  },
  createCampus: async (req, res) => {
    const { campus_name, is_extension } = req.body;

    if (!campus_name || is_extension === undefined) {
      return res.status(400).json({
        data: [],
        message: "Campus name and extension status are required.",
        status: "FAILED",
      });
    }

    try {
      const newCampus = await CampusesModel.createCampus({
        campus_name,
        is_extension,
      });
      res.status(200).json({
        data: newCampus,
        message: "Campus created successfully.",
        status: "SUCCESS",
      });
    } catch (err) {
      res.status(500).json({
        data: [],
        message: "Failed to create campus.",
        status: "FAILED",
      });
    }
  },

  updateCampus: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { campus_name, is_extension, status } = req.body;

    if (!campus_name || is_extension === undefined || !status) {
      return res.status(400).json({
        message: "All fields (campus_name, is_extension, status) are required.",
        status: "FAILED",
      });
    }

    try {
      const updatedCampus = await CampusesModel.updateCampusById(id, {
        campus_name,
        is_extension,
        status,
      });

      if (!updatedCampus) {
        return res.status(404).json({
          message: "Campus not found.",
          status: "FAILED",
        });
      }

      res.status(200).json({
        data: updatedCampus,
        message: "Campus updated successfully.",
        status: "SUCCESS",
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({
        message: "Failed to update campus.",
        status: "FAILED",
      });
    }
  },
  getAllCampusesForDropdown: async (req, res) => {
    try {
      const campuses = await CampusesModel.getAllCampusesForDropdown();
      console.log(campuses, "asd");

      res.status(200).json({
        data: campuses,
        message: "Campuses fetched for dropdown successfully.",
        status: "SUCCESS",
      });
    } catch (err) {
      console.error("Dropdown fetch error:", err);
      res.status(500).json({
        data: [],
        message: "Failed to fetch campuses for dropdown.",
        status: "FAILED",
      });
    }
  },
};

module.exports = CampusesController;
