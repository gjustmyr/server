const pool = require("../config/db.config");

const AuthModel = {
  findByEmail: async (email, role) => {
    let query = "SELECT * FROM users WHERE email_address = $1 AND role = $2";
    const res = await pool.query(query, [email, role]);
    return res.rows[0]; // Return user if found
  },
};

module.exports = AuthModel;
