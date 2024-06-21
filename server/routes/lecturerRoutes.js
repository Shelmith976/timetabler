const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
	getLecturers,
	getLecturerById,
	addLecturer,
	updateLecturer,
	loginLecturer,
	deleteLecturer,
} = require("../controllers/lecturerController");

router.get("/lecturers", getLecturers);
router.get("/get-lecturer", getLecturerById);
router.post("/add-lecturer", addLecturer);
router.post("/login-lecturer", loginLecturer);
router.put("/update-lecturer", updateLecturer);
router.delete("/delete-lecturer", deleteLecturer);
// router.post("/admin", makeAdmin);

module.exports = router;
