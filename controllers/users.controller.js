const generatePassword = require("generate-password");
const bcrypt = require("bcrypt");
const UsersModel = require("../models/users.model"); // adjust path as needed

const UsersController = {
  getAllUsers: async (req, res) => {
    try {
      const { pageNo, pageSize, keyword } = req.query;
      const users = await UsersModel.getAllUsers({
        pageNo: pageNo,
        pageSize: pageSize,
        keyword,
      });
      res.status(200).json({
        data: users.data,
        message: "Users fetched successfully.",
        status: "SUCCESS",
        total: users.total,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        data: [],
        message: "Internal server error.",
        status: "FAILED",
      });
    }
  },

  createUser: async (req, res) => {
    const {
      first_name,
      middle_name,
      last_name,
      email_address,
      contact_number,
      campus_id,
      role,
      password,
    } = req.body;
    if (
      !first_name ||
      !last_name ||
      !email_address ||
      (!campus_id && role !== "csdo")
    ) {
      return res.status(400).json({
        message: "Missing required fields.",
        status: "FAILED",
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UsersModel.createUser({
        first_name,
        middle_name,
        last_name,
        email_address,
        contact_number,
        campus_id: role === "csdo" ? null : campus_id,
        password: hashedPassword,
        role: role || null,
      });
      res.status(201).json({
        message: "User created successfully.",
        status: "SUCCESS",
      });
    } catch (err) {
      console.error("Create user error:", err);
      res.status(500).json({
        message: "Server error while creating user.",
        status: "FAILED",
      });
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const {
      first_name,
      middle_name,
      last_name,
      email_address,
      contact_number,
      campus_id,
      role, // ✅ Add this
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email_address ||
      (!campus_id && role !== "csdo")
    ) {
      return res.status(400).json({
        message: "Missing required fields.",
        status: "FAILED",
      });
    }

    try {
      const updatedUser = await UsersModel.updateUser(id, {
        first_name,
        middle_name,
        last_name,
        email_address,
        contact_number,
        campus_id: role === "csdo" ? null : campus_id,
        role: role || null,
      });

      res.status(200).json({
        data: updatedUser,
        message: "User updated successfully.",
        status: "SUCCESS",
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        message: "Server error while updating user.",
        status: "FAILED",
      });
    }
  },
  // ✅ NEW METHOD: Get all users with role 'sdo'
  getAllSdoUsers: async (req, res) => {
    try {
      const sdoUsers = await UsersModel.getUsersByRole("sdo");
      res.status(200).json({
        data: sdoUsers,
        message: "SDO users fetched successfully.",
        status: "SUCCESS",
      });
    } catch (error) {
      console.error("Error fetching SDO users:", error);
      res.status(500).json({
        data: [],
        message: "Internal server error.",
        status: "FAILED",
      });
    }
  },
};

module.exports = UsersController;
