const { exec } = require("../helpers/db");

module.exports = {
	getClasses: async (req, res) => {
		try {
			const [response] = await exec("CALL sp_get_all_subjects");
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
	getClassById: async (req, res) => {
		const { subj_code } = req.query;

		try {
			const [response] = await exec("CALL sp_get_subject_by_code(?)", [
				subj_code,
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

	addClass: async (req, res) => {
		const {
			lecturer_staffno,
			course_id,
			subject_code,
			room_num,
			batch_code,
			start_time,
			end_time,
			day_of_week,
		} = req.body;

		try {
			await exec("CALL sp_add_class(?,?,?,?,?,?,?,?)", [
				lecturer_staffno,
				course_id,
				subject_code,
				room_num,
				batch_code,
				start_time,
				end_time,
				day_of_week,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				status: 500,
				success: false,
				message: "Server error",
			});
		}
	},

	updateClass: async (req, res) => {
		const { subject_code, subject_name, has_lab, course_id } = req.body;

		try {
			// call the stored procedure sp_verify_exists
			const [subjectExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"subject",
				"subject_code",
				subject_code,
			]);

			if (subjectExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Class with that code does not exist`,
				});
			}
			const subject = subjectExists[0];

			const _subject_code = subject_code || subject.subject_code;
			const _subject_name = subject_name || subject.subject_name;
			const _has_lab = has_lab || subject.has_lab;
			const _course_id = course_id || subject.course_id;

			// call the stored procedure update_user with the subject details as the parameters
			await exec("CALL sp_update_subject (?,?,?,?)", [
				_subject_code,
				_subject_name,
				_has_lab,
				_course_id,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `subject details updated successfully`,
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
	deleteClass: async (req, res) => {
		const { subj_code } = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [subjectExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"subject",
				"subject_code",
				subj_code,
			]);

			if (subjectExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Class does not exist`,
				});
			}

			const [response] = await exec("CALL sp_delete_subject(?)", [subj_code]);

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
