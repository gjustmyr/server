const db = require("../config/db.config");

const AnnualReportModel = {
  async insert({ title, year, file_url, uploaded_by }) {
    const result = await db.query(
      `INSERT INTO annual_reports (title, year, file_url, uploaded_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, year, file_url, uploaded_by]
    );
    return result.rows[0];
  },

  async getAllAnnualReports({
    pageNo = 1,
    pageSize = 10,
    keyword = "",
    year = null,
  } = {}) {
    const offset = (pageNo - 1) * pageSize;
    const kw = `%${keyword}%`;

    let baseQuery = `
    SELECT ar.report_id, ar.title, ar.year, ar.file_url, ar.uploaded_at, 
           u.user_id,
           CONCAT(u.first_name, ' ', COALESCE(u.middle_name || ' ', ''), u.last_name) AS full_name
    FROM annual_reports ar
    JOIN users u ON ar.uploaded_by = u.user_id
    WHERE ar.title ILIKE $1
  `;

    const params = [kw];

    if (year) {
      baseQuery += ` AND ar.year = $2`;
      params.push(year);
      baseQuery += ` ORDER BY ar.uploaded_at DESC LIMIT $3 OFFSET $4`;
      params.push(pageSize, offset);
    } else {
      baseQuery += ` ORDER BY ar.uploaded_at DESC LIMIT $2 OFFSET $3`;
      params.push(pageSize, offset);
    }

    const result = await db.query(baseQuery, params);
    return result.rows;
  },
};

module.exports = AnnualReportModel;
