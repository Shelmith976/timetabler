const express = require("express");
const router = express.Router();

const {
	getDepartments,
	addDepartment,
	updateDepartment,
	deleteDepartment,
	getDepartmentById,
} = require("../controllers/departmentController");

router.get("/departments", getDepartments);
router.get("/get-department", getDepartmentById);
router.post("/add-department", addDepartment);
router.put("/update-department", updateDepartment);
router.delete("/delete-department", deleteDepartment);

module.exports = router;
