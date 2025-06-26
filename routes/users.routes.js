const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users.controller");

// GET all users
router.get("/", UsersController.getAllUsers);

// ✅ GET all users with role 'sdo'
router.get("/sdo", UsersController.getAllSdoUsers);

// POST create user
router.post("/", UsersController.createUser);

// PUT update user
router.put("/:id", UsersController.updateUser);

module.exports = router;
