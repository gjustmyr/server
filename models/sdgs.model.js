const pool = require("../config/db.config");

const SDGsModel = {
  getAllSDGs: async () => {
    const result = await pool.query("SELECT * FROM sdgs ORDER BY sdg_no ASC");
    return result.rows;
  },
};

module.exports = SDGsModel;
