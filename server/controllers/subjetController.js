const { exec } = require("../helpers/db");

module.exports = {
	getSubjects: async (req, res) => {
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
	getSubjectById: async (req, res) => {
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

	addSubject: async (req, res) => {
		const { subject_code, subject_name, has_lab, course_id, batch_id } =
			req.body;
		try {
			const [subjectExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"subject",
				"subject_code",
				subject_code,
			]);

			if (subjectExists.length > 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: "Subject with that code already exists, try a different subject code",
				});
			}

			await exec("CALL sp_add_subject(?,?,?,?,?)", [
				subject_code,
				subject_name,
				has_lab,
				course_id,
				batch_id,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message:"A subject has been registered successfully",
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
	updateSubject: async (req, res) => {
		const { subject_code, subject_name, has_lab, course_id, batch_id } =
			req.body;
		const { subjectId } = req.query;
		try {
			const [subjectExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"subject",
				"subject_id",
				subjectId,
			]);

			if (subjectExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: "Subject with that id does not exist",
				});
			}
			const subject = subjectExists[0];
			const _subject_id = subjectId || subject._subject_id;
			const _subject_code = subject_code || subject.subject_code;
			const _subject_name = subject_name || subject.subject_name;
			const _has_lab = has_lab || subject.has_lab;
			const _course_id = course_id || subject.course_id;
			const _batch_id = batch_id || subject.batch_id;

			await exec("CALL sp_update_subject (?,?,?,?,?,?)", [
				_subject_id,
				_subject_code,
				_subject_name,
				_has_lab,
				_course_id,
				_batch_id,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: "subject details updated successfully",
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
	deleteSubject: async (req, res) => {
		const { subjectId} = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [subjectExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"subject",
				"subject_id",
				subjectId,
			]);

			if (subjectExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Subject does not exist`,
				});
			}

			const [response] = await exec("CALL sp_delete_subject(?)", [subjectId]);

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
