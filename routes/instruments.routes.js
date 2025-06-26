const express = require("express");
const router = express.Router();

const InstrumentsController = require("../controllers/instruments.controller");

// GET all instruments (paginated + keyword)
router.get("/", InstrumentsController.getAllInstruments);

// GET full instrument by ID
router.get("/:id", InstrumentsController.getInstrumentById);

// POST new full instrument
router.post("/", InstrumentsController.createInstrument);

module.exports = router;
