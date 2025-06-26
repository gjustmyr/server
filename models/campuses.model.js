const pool = require("../config/db.config");

const CampusesModel = {
  getAllCampuses: async ({ pageNo = 1, pageSize = 10, keyword = "" } = {}) => {
    const offset = pageNo * pageSize;
    const searchTerm = `%${keyword}%`;

    const dataQuery = `
    SELECT * FROM campuses
    WHERE campus_name ILIKE $1
    ORDER BY campus_id DESC
    LIMIT $2 OFFSET $3
  `;

    const countQuery = `
    SELECT COUNT(*) FROM campuses
    WHERE campus_name ILIKE $1
  `;

    const [dataRes, countRes] = await Promise.all([
      pool.query(dataQuery, [searchTerm, pageSize, offset]),
      pool.query(countQuery, [searchTerm]),
    ]);

    return {
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
    };
  },

  getCampusById: async (campusId) => {
    const query = `
    SELECT * FROM campuses
    WHERE campus_id = $1
  `;
    const res = await pool.query(query, [campusId]);
    return res.rows[0]; // Return a single campus
  },

  createCampus: async ({ campus_name, is_extension }) => {
    const res = await pool.query(
      "INSERT INTO campuses (campus_name, is_extension) VALUES ($1, $2) RETURNING *",
      [campus_name, is_extension]
    );
    return res.rows[0];
  },
  updateCampusById: async (id, { campus_name, is_extension, status }) => {
    const query = `
      UPDATE campuses
      SET campus_name = $1,
          is_extension = $2,
          status = $3
      WHERE campus_id = $4
      RETURNING *;
    `;
    const values = [campus_name, is_extension, status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  getAllCampusesForDropdown: async () => {
    const query = `
    SELECT campus_id, campus_name 
    FROM campuses 
    ORDER BY campus_name ASC
  `;
    const res = await pool.query(query);
    console.log(res, "ASd");

    return res.rows;
  },
};

module.exports = CampusesModel;
