const mysql = require("mysql2/promise"); // use mysql2/promise for async/await support
require("dotenv").config();
const dbConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
	host: "localhost",
};
class Connection {
	constructor() {
		this.connectToDatabase();
	}
	connectToDatabase = async () => {
		try {
			this.pool = await mysql.createPool(dbConfig); // create a connection pool
			console.log("Connected to database");
		} catch (error) {
			console.log(error.message);
			throw new Error(error.message);
		}
	};
	exec = async (procedure, data = {}) => {
		try { 	
			const [results] = await this.pool?.query(procedure, Object.values(data)); // execute a query with parameters
			return results;
		} catch (error) {
			console.log(error.message);
			throw new Error(error.message);
		}
	};
}
module.exports = {
	exec: new Connection().exec,
};
