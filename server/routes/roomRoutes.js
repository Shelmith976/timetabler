const express = require("express");
const router = express.Router();

const {
	getRoomById,
	getRooms,
	addRoom,
	updateRoom,
	deleteRoom,
} = require("../controllers/roomController");

router.get("/rooms", getRooms);
router.get("/get-room", getRoomById);
router.post("/add-room", addRoom);
router.put("/update-room", updateRoom);
router.delete("/delete-room", deleteRoom);

module.exports = router;
