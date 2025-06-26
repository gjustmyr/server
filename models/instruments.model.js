const db = require("../config/db.config");

const InstrumentModel = {
  async getAll({ pageNo = 1, pageSize = 10, keyword = "" } = {}) {
    const offset = pageNo * pageSize;
    const kw = `%${keyword}%`;

    const data = await db.query(
      `SELECT i.instrument_id, s.sdg_no, s.sdg_name
       FROM instruments i
       JOIN sdgs s ON i.sdg_id = s.sdg_id
       WHERE CAST(s.sdg_no AS TEXT) ILIKE $1 OR s.sdg_name ILIKE $1
       ORDER BY i.instrument_id DESC
       LIMIT $2 OFFSET $3`,
      [kw, pageSize, offset]
    );

    return data.rows;
  },

  async getFullInstrumentById(id) {
    const result = await db.query(
      "SELECT get_full_instrument_by_id($1) AS instrument",
      [id]
    );

    return result.rows[0]?.instrument;
  },
  // Existing methods: getAll, getFullInstrumentById...

  // models/instruments.model.js
  async createInstrument(data) {
    const result = await db.query(`SELECT insert_full_instrument($1::JSON)`, [
      data,
    ]);
    return result;
  },
};

module.exports = InstrumentModel;
