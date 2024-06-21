const express = require("express");
require("dotenv").config();

const dept_router = require("./routes/departmentRoutes");
const lec_router = require("./routes/lecturerRoutes");
const crs_router = require("./routes/courseRoutes");
const bat_router = require("./routes/batchRoutes");
const sub_router = require("./routes/subjectRoutes");
const rm_router = require("./routes/roomRoutes");
const sch_router = require("./routes/scheduleRoutes");
const cls_router = require("./routes/trialRoutes");
const csv_router= require("./routes/roomCsvRoutes");
const usr_router=require("./routes/userRoutes");
const cors = require("cors");
const { verifyToken } = require("./controllers/userController");

const app = express();

const port = process.env.PORT || 3016;
// sessions

app.use(express.json());
app.use(cors());
app.use("/user", usr_router);
app.use("/dept",  dept_router);
app.use("/lec", lec_router);
app.use("/crs", crs_router);
app.use("/bat", bat_router);
app.use("/sub", sub_router);
app.use("/rm", rm_router);
app.use("/sch", verifyToken, sch_router);
app.use("/cls",  cls_router);
// app.use("/csv", verifyToken, csv_router);



app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.json({
		status: err.status,
		success: false,
		message: err.message,
	});
});

app.listen(port, () => {
	console.log(`running port: ${port}`);
});
