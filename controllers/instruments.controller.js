const InstrumentsModel = require("../models/instruments.model");

const InstrumentsController = {
  // GET /api/instruments?pageNo=1&pageSize=10&keyword=goal
  getAllInstruments: async (req, res) => {
    try {
      const { pageNo = 1, pageSize = 10, keyword = "" } = req.query;

      const instruments = await InstrumentsModel.getAll({
        pageNo: parseInt(pageNo),
        pageSize: parseInt(pageSize),
        keyword,
      });

      res.status(200).json({
        data: instruments,
        message: "Instruments fetched successfully.",
        status: "SUCCESS",
      });
    } catch (err) {
      console.error("Error fetching instruments:", err);
      res.status(500).json({
        data: [],
        message: "Failed to fetch instruments.",
        status: "FAILED",
      });
    }
  },

  // GET /api/instruments/:id
  getInstrumentById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        data: null,
        message: "Instrument ID is required.",
        status: "FAILED",
      });
    }

    try {
      const instrument = await InstrumentsModel.getFullInstrumentById(id);

      if (!instrument) {
        return res.status(404).json({
          data: null,
          message: "Instrument not found.",
          status: "FAILED",
        });
      }

      res.status(200).json({
        data: instrument,
        message: "Instrument fetched successfully.",
        status: "SUCCESS",
      });
    } catch (err) {
      console.error("Error fetching instrument by ID:", err);
      res.status(500).json({
        data: null,
        message: "Failed to fetch instrument.",
        status: "FAILED",
      });
    }
  },

  createInstrument: async (req, res) => {
    const { sdg_id, sections } = req.body;

    if (!sdg_id || !Array.isArray(sections)) {
      return res.status(400).json({
        data: null,
        message: "Invalid request: sdg_id and sections[] are required.",
        status: "FAILED",
      });
    }

    try {
      const result = await InstrumentsModel.createInstrument({
        sdg_id,
        sections,
      });

      res.status(201).json({
        data: result,
        message: "Instrument created successfully.",
        status: "SUCCESS",
      });
    } catch (err) {
      console.error("Error creating instrument:", err);
      res.status(500).json({
        data: null,
        message: "Failed to create instrument.",
        status: "FAILED",
      });
    }
  },
};

module.exports = InstrumentsController;
