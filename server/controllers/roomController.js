const { exec } = require("../helpers/db");

module.exports = {
	getRooms: async (req, res) => {
		try {
			const [response] = await exec("CALL sp_get_all_rooms");
			return res.status(200).json({
				status: 200,
				success: true,
				data: response,
			});
		} catch (error) {
			console.log(error.message);
			res.status(500).json({
				status: 500,
				success: false,
				message: error.message,
			});
		}
	},
	getRoomById: async (req, res) => {
		const { roomId } = req.query;

		try {
			const [response] = await exec("CALL sp_get_room_by_id(?)", [roomId]);
			return res.status(200).json({
				status: 200,
				success: true,
				data: response,
			});
		} catch (error) {
			console.error(error.message);
			res.status(500).json({
				status: 500,
				success: false,
				message: error.message,
			});
		}
	},

	addRoom: async (req, res) => {
		const { room_num, room_name, room_type, room_capacity } = req.body;

		try {
			const [roomExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"room",
				"room_num",
				room_num,
			]);

			if (roomExists.length > 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Room with that code already exists, try a different room code`,
				});
			}

			// call the stored procedure  with the room details as the parameters
			await exec("CALL sp_add_room(?,?,?,?)", [
				room_num,
				room_name,
				room_type,
				room_capacity,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `A room has been registered successfully`,
			});
		} catch (error) {
			console.log(error.message);
			res.status(500).json({
				status: 500,
				success: false,
				message: error.message,
			});
		}
	},

	updateRoom: async (req, res) => {
		const { roomId } = req.query;

		const { room_num, room_name, room_type, room_capacity } = req.body;

		try {
			// call the stored procedure sp_verify_exists
			const [roomExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"room",
				"room_id",
				roomId,
			]);

			if (roomExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Room with that code does not exist`,
				});
			}
			const room = roomExists[0];

			const _room_Id = roomId || room.room_id;
			const _room_num = room_num || room.room_num;
			const _room_name = room_name || room.room_name;
			const _room_type = room_type || room.room_type;
			const _room_capacity = room_capacity || room.room_capacity;

			// call the stored procedure update_user with the room details as the parameters
			await exec("CALL sp_update_room (?,?,?,?,?)", [
				_room_Id,
				_room_num,
				_room_name,
				_room_type,
				_room_capacity,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `room details updated successfully`,
			});
		} catch (error) {
			console.log(error.message);
			res.status(500).json({
				status: 500,
				success: false,
				message: error.message,
			});
		}
	},
	deleteRoom: async (req, res) => {
		const { roomId } = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [roomExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"room",
				"room_id",
				roomId,
			]);

			if (roomExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Room does not exist`,
				});
			}

			const [response] = await exec("CALL sp_delete_room(?)", [roomId]);

			console.log(response);

			return res.status(200).json({
				status: 200,
				success: true,
				data: response,
			});
		} catch (error) {
			console.error(error.message);
			res.status(500).json({
				status: 500,
				success: false,
				message: error.message,
			});
		}
	},
};
