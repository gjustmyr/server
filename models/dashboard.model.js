// models/dashboardModel.js
const pool = require("../config/db.config");

const getSdgRecordValues = async (campusId, year) => {
  const query = `
    SELECT * FROM get_dashboard_data($1, $2)
  `;
  const values = [year, campusId];
  const { rows } = await pool.query(query, values);
  return rows;
};

const getSdgRecordScores = async (userId, year) => {
  const query = `
    SELECT get_sdg_data_by_campus_and_year($1, $2) AS data
  `;
  const values = [userId, year];
  const { rows } = await pool.query(query, values);

  return rows[0]?.data || null; // Return the JSON output
};

const getAllCampusSdgRecordScores = async (year, sdg_id) => {
  console.log(year, sdg_id, "ASd");

  const query = `
    SELECT get_sdg_data_by_year($1, $2) AS data
  `;
  const values = [year, sdg_id];
  const { rows } = await pool.query(query, values);

  return rows[0]?.data || null;
};

const getCampusIdByUserId = async (userId) => {
  const query = `
    SELECT campus_id FROM campuses WHERE user_id = $1
  `;
  const values = [userId];
  const { rows } = await pool.query(query, values);

  return rows[0]?.campus_id || null;
};
module.exports = {
  getSdgRecordValues,
  getSdgRecordScores,
  getAllCampusSdgRecordScores,
  getCampusIdByUserId,
};
