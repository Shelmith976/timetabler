const express = require("express");
const router = express.Router();

const {
	getBatches,
	getBatchById,
	addBatch,
	updateBatch,
	deleteBatch,
	getBatchesByCourse,
} = require("../controllers/batchController");

router.get("/batches", getBatches);
router.get("/get-batch", getBatchById);
router.post("/add-batch", addBatch);
router.put("/update-batch", updateBatch);
router.delete("/delete-batch", deleteBatch);
router.get("/batchsubjects", getBatchesByCourse);

module.exports = router;