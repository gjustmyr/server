const AuthModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const AuthController = {
  login: async (req, res) => {
    const { email_address, password, role } = req.body;
    console.log(req.body);

    if (!email_address || !password) {
      return res.status(400).json({
        data: [],
        message: "Email and password are required.",
        status: "FAILED",
      });
    }

    try {
      const user = await AuthModel.findByEmail(email_address, role);

      if (!user) {
        return res.status(200).json({
          data: [],
          message: "Invalid email address and password",
          status: "FAILED",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(200).json({
          data: [],
          message: "Invalid email address and password",

          status: "FAILED",
        });
      }

      const payload = {
        user_id: user.user_id,
        email_address: user.email_address,
        campus_id: user.campus_id,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json({
        data: {
          token,
          user: {
            user_id: user.user_id,
            full_name: `${user.first_name} ${user.last_name}`,
            email_address: user.email_address,
            campus_id: user.campus_id,
          },
        },
        message: "Login successful.",
        status: "SUCCESS",
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        data: [],
        message: "Internal server error.",
        status: "FAILED",
      });
    }
  },
};

module.exports = AuthController;
