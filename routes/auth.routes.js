const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/", AuthController.login);

module.exports = router;
