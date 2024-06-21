const { exec } = require("../helpers/db");
// const { signUpEmail } = require("./mailController");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ToDO
// reset password

module.exports = {
	getLecturers: async (req, res) => {
		try {
			const [response] = await exec("CALL sp_get_all_lecturers");
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
	getLecturerById: async (req, res) => {
		const { lec_id } = req.query;

		try {
			const [response] = await exec("CALL sp_get_lecturer_by_Id(?)", [lec_id]);
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

	addLecturer: async (req, res) => {
		const {
			staff_no,
			first_name,
			last_name,
			department_id,
			// user_name,
			preferred_days,
		} = req.body;
		const user_name = first_name + '_'+ last_name
		try {
			// call the stored procedure sp_verify_exists with email as the parameter
			const [lecturerExists] = await exec("CALL sp_verify_staffnum_exists (?)", [
				staff_no,
			]);

			if (lecturerExists.length > 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Lecturer already exists, try a different email`,
				});
			}

			// const hashPass = await bcrypt.hash(password, 8);

			// call the stored procedure insert_user with the lecturer details as the parameters
			await exec("CALL sp_add_lecturer(?,?,?,?,?,?)", [
				staff_no,
				first_name,
				last_name,
				user_name,
				department_id,
				preferred_days,
			]);
			const token = jwt.sign({ user_name }, "process.env.JWTKEY", {
				expiresIn: "1h",
			});
			// signUpEmail(email, first_name, last_name, user_name);
			return res.status(201).json({
				status: 201,
				success: true,
				message: `A lecturer has been registered successfully`,
				token: token,
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
	loginLecturer: async (req, res) => {
		const { staff_no, password } = req.body;
		try {
			// call the stored procedure sp_verify_exists with email as the parameter
			const [lecturerExists] = await exec("CALL sp_verify_staffnum_exists (?)", [
				staff_no,
			]);


			if (lecturerExists.length > 0) {

				

				return res.status(201).json({
					status: 201,
					success: true,
					message: "logged in successfully",
					// token,
				});
			} else {
				return res.status(401).json({
					status: 401,
					success: false,
					message: "Invalid credentials!",
				});
			}
		} catch (error) {
			console.log(error.message);
			res.status(500).json({
				status: 500,
				success: false,
				message: error.message,
			});
		}
	},
	updateLecturer: async (req, res) => {
		const {
			    
				first_name,
				last_name,
				department_id,
				preferred_days,
		} = req.body;
		
		const { lecturerId } = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [lecturerExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"lecturer",
				"lecturer_id",
				lecturerId,
			]);

			if (lecturerExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Lecturer does not exist`,
				});
			}
			const lecturer = lecturerExists[0];

			const _lecturer_id = lecturerId || lecturer.lecturer_id;
			const _first_name = first_name || lecturer.first_name;
			const _last_name = last_name || lecturer.last_name;
			const _department_id = department_id || lecturer.department_id;
			const _preferred_days = preferred_days || lecturer.preferred_days;

			// call the stored procedure update_user with the lecturer details as the parameters
			await exec("CALL sp_update_lecturer (?,?,?,?,?)", [
				_lecturer_id,
				_first_name,
				_last_name,
				_department_id,
				_preferred_days,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `lecturer details updated successfully`,
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
	deleteLecturer: async (req, res) => {
		const { lecturerId } = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [lecturerExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"lecturer",
				"lecturer_id",
				lecturerId,
			]);

			if (lecturerExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Lecturer does not exist`,
				});
			}

			const [response] = await exec("CALL sp_delete_lecturer(?)", [lecturerId]);


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
	makeAdmin: async (req, res) => {
		const { email } = req.body;
		try {
			// call the stored procedure sp_verify_exists with email as the parameter
			const [response] = await exec("CALL sp_verify_exists (?)", [email]);
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
};
