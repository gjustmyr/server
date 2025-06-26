const SDGsModel = require("../models/sdgs.model");

const SDGsController = {
  getAllSDGs: async (req, res) => {
    try {
      const sdgs = await SDGsModel.getAllSDGs();
      res.status(200).json({
        data: sdgs,
        message: "SDGs fetched successfully.",
        status: "SUCCESS",
      });
    } catch (error) {
      console.error("Error fetching SDGs:", error);
      res.status(500).json({
        data: [],
        message: "Failed to fetch SDGs.",
        status: "FAILED",
      });
    }
  },
};

module.exports = SDGsController;
