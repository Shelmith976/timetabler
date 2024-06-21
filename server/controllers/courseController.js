const { exec } = require("../helpers/db");

module.exports = {
	getCourses: async (req, res) => {
		try {
			const [response] = await exec("CALL sp_get_all_courses");
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
	getCourseById: async (req, res) => {
		const { courseId } = req.query;

		try {
			const [response] = await exec("CALL sp_get_course_by_Id(?)", [courseId]);
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

	addCourse: async (req, res) => {
		const { course_name, department_id } = req.body;
		try {
			// call the stored procedure sp_verify_exists with email as the parameter
			const [courseExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"course",
				"course_name",
				course_name,
			]);

			if (courseExists.length > 0) {
				console.log(courseExists);
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Course with that name already exists, try a different course name`,
				});
			}

			// call the stored procedure  with the course details as the parameters
			await exec("CALL sp_add_course(?,?)", [course_name, department_id]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `A course has been registered successfully`,
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

	updateCourse: async (req, res) => {
		const { course_name, department_id } = req.body;
		const { courseId } = req.query;


		try {
			// call the stored procedure sp_verify_exists
			const [courseExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"course",
				"course_id",
				courseId,
			]);

			if (courseExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Course with that id does not exist`,
				});
			}
			const course = courseExists[0];
			const _course_id =  courseId|| course.course_id;
			const _course_name = course_name || course.course_name;
			const _department_id = department_id || course.department_id;

			// call the stored procedure with the course details as the parameters
			await exec("CALL sp_update_course (?,?,?)", [
				_course_id,
				_course_name,
				_department_id,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `Course details updated successfully`,
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
	deleteCourse: async (req, res) => {
		const { courseId } = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [courseExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"course",
				"course_id",
				courseId,
			]);

			if (courseExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Course does not exist`,
				});
			}

			const [response] = await exec("CALL sp_delete_course(?)", [courseId]);

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
