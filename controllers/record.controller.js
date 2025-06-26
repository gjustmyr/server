// server/controllers/record.controller.js
const recordModel = require("../models/record.model");

exports.submitRecord = async (req, res) => {
  const { instrument_id, user_id, answers, year } = req.body;

  if (!instrument_id || !user_id || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Missing required data" });
  }

  try {
    const record_id = await recordModel.createRecord(
      instrument_id,
      user_id,
      year
    );
    await recordModel.addRecordValues(record_id, answers);

    res.status(201).json({ message: "Record saved", record_id });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Failed to save record" });
  }
};

exports.getRecordByUser = async (req, res) => {
  const { instrument_id, user_id, year } = req.params;
  console.log(req.params, "asd");

  try {
    const record = await recordModel.getUserRecord(
      instrument_id,
      user_id,
      year
    );
    if (!record) return res.status(404).json({ message: "No record found" });
    res.json(record);
  } catch (err) {
    console.error("Error fetching record:", err);
    res.status(500).json({ error: "Failed to fetch record" });
  }
};

exports.updateRecord = async (req, res) => {
  const { record_id } = req.params;
  const { answers } = req.body;
  try {
    await recordModel.updateRecord(record_id, answers);
    res.json({ message: "Record updated" });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ error: "Failed to update record" });
  }
};

exports.updateStatus = async (req, res) => {
  const { record_id } = req.params;
  const { status, remarks } = req.body;

  if (!["pending", "approved", "for_revision"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const updated = await recordModel.updateStatus(record_id, status, remarks);
    res.json({ message: "Status updated", updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};
