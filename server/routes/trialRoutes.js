const express = require("express");
const router = express.Router();

const {
	generateAndAddClass,
	getClasses,
} = require("../controllers/generateClassController");

router.get("/generate", generateAndAddClass);
router.get("/classes", getClasses);

module.exports = router;
