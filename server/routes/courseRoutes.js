const express = require("express");
const router = express.Router();

const {
	getCourses,
	getCourseById,
	addCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courseController");

router.get("/courses", getCourses);
router.get("/get-course", getCourseById);
router.post("/add-course", addCourse);
router.put("/update-course", updateCourse);
router.delete("/delete-course", deleteCourse);

module.exports = router;
