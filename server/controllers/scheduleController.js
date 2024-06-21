const { exec } = require("../helpers/db");
module.exports = {
	getSchedule: async (req, res) => {
		const { lecturer_id } = req.query;

		try {
			const [response] = await exec("CALL sp_lecturer_schedule (?)", [
				lecturer_id,
			]);
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
