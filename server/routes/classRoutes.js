const express = require("express");
const router = express.Router();

const {
	addClass,
	getClassById,
	getClasses,
	updateClass,
	deleteClass,
} = require("../controllers/classController");

router.get("/timetable", getClasses);
router.get("/get-subject", getClassById);
router.post("/generate", addClass);
router.put("/update-subject", updateClass);
router.delete("/delete-subject", deleteClass);

module.exports = router;
