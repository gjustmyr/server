// server/models/record.model.js
const db = require("../config/db.config");

const createRecord = async (instrument_id, user_id, year) => {
  const res = await db.query(
    "INSERT INTO records (instrument_id, user_id, year) VALUES ($1, $2, $3) RETURNING record_id",
    [instrument_id, user_id, year]
  );
  return res.rows[0].record_id;
};

const addRecordValues = async (record_id, answers) => {
  const insertPromises = answers.map((a) =>
    db.query(
      "INSERT INTO record_values (record_id, sub_id, field_value) VALUES ($1, $2, $3)",
      [record_id, a.sub_id, a.field_value]
    )
  );
  await Promise.all(insertPromises);
};

// Fetch record + values for a given user and instrument for a specific year
async function getUserRecord(instrument_id, user_id, year) {
  const res = await db.query(
    `SELECT r.record_id, rv.sub_id, rv.field_value, r.status
     FROM records r
     LEFT JOIN record_values rv ON rv.record_id = r.record_id
     WHERE r.instrument_id = $1 AND r.user_id = $2 AND r.year = $3`,
    [instrument_id, user_id, year]
  );

  if (res.rows.length === 0) return null;

  const record_id = res.rows[0].record_id;
  const status = res.rows[0].status;
  const answers = res.rows.map((row) => ({
    sub_id: row.sub_id,
    field_value: row.field_value,
  }));

  return { record_id, status, answers };
}

// Update existing record values
async function updateRecord(record_id, answers) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Remove old values
    await client.query("DELETE FROM record_values WHERE record_id = $1", [
      record_id,
    ]);

    // Insert new values
    const insertValues = answers.map((ans) =>
      client.query(
        "INSERT INTO record_values (record_id, sub_id, field_value) VALUES ($1, $2, $3)",
        [record_id, ans.sub_id, ans.field_value]
      )
    );
    await Promise.all(insertValues);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
async function updateStatus(record_id, status) {
  const result = await db.query(
    `UPDATE records SET status = $1 WHERE record_id = $2 RETURNING *`,
    [status, record_id]
  );

  if (result.rowCount === 0) {
    throw new Error("Record not found or update failed");
  }

  return result.rows[0];
}
module.exports = {
  createRecord,
  addRecordValues,
  getUserRecord,
  updateRecord,
  updateStatus, // ✅ Export it
};
