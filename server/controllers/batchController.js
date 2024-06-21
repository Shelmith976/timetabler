const { exec } = require("../helpers/db");

module.exports = {
	getBatches: async (req, res) => {
		try {
			const [response] = await exec("CALL sp_get_all_batches");
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
	getBatchById: async (req, res) => {
		const { batchCode } = req.query;

		try {
			const [response] = await exec("CALL sp_get_batch_by_code(?)", [
				batchCode,
			]);
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

	addBatch: async (req, res) => {
		const { batch_code, batch_name, course_id, year, semester ,batch_size} = req.body;
		try {
			// call the stored procedure sp_verify_exists with email as the parameter
			const [batchExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"batch",
				"batch_code",
				batch_code,
			]);

			if (batchExists.length > 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Batch with that code already exists, try a different batch code`,
				});
			}

			// call the stored procedure  with the batch details as the parameters
			await exec("CALL sp_add_batch(?,?,?,?,?,?)", [
				batch_code,
				batch_name,
				course_id,
				year,
				semester,
				batch_size,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `A batch has been registered successfully`,
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

	updateBatch: async (req, res) => {
		const { batch_code, batch_name, course_id, year, semester ,batch_size} = req.body;
		const { batchId } = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [batchExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"batch",
				"batch_id",
				batchId,
			]);

			if (batchExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Batch with that id does not exist`,
				});
			}
			const batch = batchExists[0];
			const _batch_id = batchId || batch.batch_id;
			const _batch_code = batch_code || batch.batch_code;
			const _batch_name = batch_name || batch.batch_name;
			const _course_id = course_id || batch.course_id;
			const _year = year || batch.year;
			const _semester = semester || batch.semester;
			const _batch_size = batch_size || batch.batch_size;

			// call the stored procedure with the batch details as the parameters
			await exec("CALL sp_update_batch (?,?,?,?,?,?,?)", [
				_batch_id,
				_batch_code,
				_batch_name,
				_course_id,
				_year,
				_semester,
				_batch_size,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `Batch details updated successfully`,
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
	deleteBatch: async (req, res) => {
		const { batchId } = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [batchExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"batch",
				"batch_id",
				batchId,
			]);

			if (batchExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Batch does not exist`,
				});
			}

			const [response] = await exec("CALL sp_delete_batch(?)", [batchId]);

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
	getBatchesByCourse: async (req, res) => {
		const { course_id } = req.query;

		try {
			const [response] = await exec("CALL sp_get_batches_by_course(?)", [
				course_id,
			]);
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
