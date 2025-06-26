const express = require("express");
const router = express.Router();
const SDGsController = require("../controllers/sdgs.controller");

router.get("/", SDGsController.getAllSDGs);

module.exports = router;
