const express = require("express");
const router = express.Router();
const CampusesController = require("../controllers/campuses.controller");

router.get("/", CampusesController.getAllCampuses);
router.get("/dropdown", CampusesController.getAllCampusesForDropdown);
router.get("/:id", CampusesController.getCampusById);
router.post("/", CampusesController.createCampus);
router.put("/:id", CampusesController.updateCampus);

module.exports = router;
