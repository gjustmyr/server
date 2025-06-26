const pool = require("../config/db.config");
require("dotenv").config();
const nodemailer = require("nodemailer");

const UsersModel = {
  getAllUsers: async ({ pageNo = 1, pageSize = 10, keyword = "" } = {}) => {
    const offset = (pageNo - 1) * pageSize;
    const searchTerm = `%${keyword}%`;

    const dataQuery = `
      SELECT u.user_id, u.first_name, u.middle_name, u.last_name,
             u.email_address, u.contact_number, u.campus_id,
             c.campus_name, u.role, u.created_at
      FROM users u
      LEFT JOIN campuses c ON u.campus_id = c.campus_id
      WHERE u.first_name ILIKE $1
         OR u.middle_name ILIKE $1
         OR u.last_name ILIKE $1
         OR u.email_address ILIKE $1
         OR c.campus_name ILIKE $1
      ORDER BY u.user_id DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) FROM users u
      LEFT JOIN campuses c ON u.campus_id = c.campus_id
      WHERE u.first_name ILIKE $1
         OR u.middle_name ILIKE $1
         OR u.last_name ILIKE $1
         OR u.email_address ILIKE $1
         OR c.campus_name ILIKE $1
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

  createUser: async (userData) => {
    let {
      first_name,
      middle_name,
      last_name,
      email_address,
      contact_number,
      campus_id,
      password,
      role,
    } = userData;

    if (role === "csdo") {
      campus_id = null;
    }

    const result = await pool.query(
      `INSERT INTO users (
        first_name, middle_name, last_name, email_address,
        contact_number, campus_id, password, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        first_name,
        middle_name || null,
        last_name,
        email_address,
        contact_number || null,
        campus_id || null,
        password,
        role || null,
      ]
    );

    return result.rows[0];
  },

  updateUser: async (userId, userData) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (userData.role === "csdo") {
      userData.campus_id = null;
    }

    for (const [key, value] of Object.entries(userData)) {
      fields.push(`${key} = $${idx}`);
      values.push(value ?? null);
      idx++;
    }

    values.push(userId); // Add userId for WHERE clause

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE user_id = $${idx}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getUsersByRole: async (role) => {
    const query = `
    SELECT 
      user_id, first_name, middle_name, last_name, email_address, role
    FROM users
    WHERE role = $1
    ORDER BY last_name, first_name
  `;

    const result = await pool.query(query, [role]);
    return result.rows;
  },
};

module.exports = UsersModel;
