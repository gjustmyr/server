// server/routes/record.routes.js
const express = require("express");
const router = express.Router();
const recordController = require("../controllers/record.controller");

router.post("/", recordController.submitRecord);
router.get("/:instrument_id/:user_id/:year", recordController.getRecordByUser);
router.patch("/:record_id", recordController.updateRecord);
router.patch("/:record_id/status", recordController.updateStatus);

module.exports = router;
