const { exec } = require("../helpers/db");

module.exports = {
	getDepartments: async (req, res) => {
		try {
			const [response] = await exec("CALL sp_get_all_departments");
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
	getDepartmentById: async (req, res) => {
		const { departmentId } = req.query;

		try {
			const [response] = await exec("sp_get_department_by_Id(?)", [
				departmentId,
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

	addDepartment: async (req, res) => {
		const { department_id, department_code, department_name } = req.body;
		try {
			// call the stored procedure sp_verify_exists with email as the parameter
			const [departmentExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"department",
				"department_name",
				department_name,
			]);

			if (departmentExists.length > 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Department with that code already exists, try a different department code`,
				});
			}

			// call the stored procedure  with the department details as the parameters
			await exec("CALL sp_add_department(?,?)", [
				department_code,
				department_name,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `A department has been registered successfully`,
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

	updateDepartment: async (req, res) => {
		const { department_code, department_name } = req.body;
		const { departmentId } = req.query;

		try {
			const [departmentExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"department",
				"department_id",
				departmentId,
			]);

			if (departmentExists.length == 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Department with that id does not exist`,
				});
			}

			const department = departmentExists[0];
			const _department_id = departmentId || department.department_id;
			const _department_code = department_code || department.department_code;
			const _department_name = department_name || department.department_name;

			await exec("CALL sp_update_department (?,?,?)", [
				_department_id,
				_department_code,
				_department_name,
			]);

			return res.status(201).json({
				status: 201,
				success: true,
				message: `Department details updated successfully`,
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

	deleteDepartment: async (req, res) => {
		const { departmentId } = req.query;

		try {
			// call the stored procedure sp_verify_exists
			const [departmentExists] = await exec("CALL sp_verify_exists (?,?,?)", [
				"department",
				"department_id",
				departmentId,
			]);

			if (departmentExists.length === 0) {
				return res.status(401).json({
					status: 401,
					success: false,
					message: `Department does not exist`,
				});
			}

			const response = await exec("CALL sp_delete_department(?)", [
				departmentId,
			]);

			if (!response) {
				// Handle the case where the response is undefined or null
				return res.status(500).json({
					status: 500,
					success: false,
					message: "Error deleting department",
				});
			}

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
