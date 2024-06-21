const express = require("express");
const router = express.Router();

const {
	getSubjects,
	getSubjectById,
	addSubject,
	updateSubject,
	deleteSubject,
} = require("../controllers/subjetController");

router.get("/subjects", getSubjects);
router.get("/get-subject", getSubjectById);
router.post("/add-subject", addSubject);
router.put("/update-subject", updateSubject);
router.delete("/delete-subject", deleteSubject);

module.exports = router;
