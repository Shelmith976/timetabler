import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import {getClasses} from "./api"
import "./App.css";

import {
	LoginPage,
	CoursesPage,
	LecturersPage,
	SubjectsPage,
	RoomsPage,
	DepartmentsPage,
	BatchesPage,
	ClassesPage,
	StudentPage,
	LecturerPage,
	AdminPage,
	Adminmain
} from "./pages";

const App = () => {
	const [classes, setClasses] = useState([]);
	const fetchClasses = async () => {
		try {
			const classData = await getClasses();
			const transformedData = classData.data.map((schedule, index) => ({
				staffno: schedule.lecturer_staffno,
				subjectCode: schedule.subject_code,
				roomNum: schedule.room_num,
				batchCode: schedule.batch_code,
				startTime: schedule.start_time,
				endTime: schedule.end_time,
				dayOfWeek: schedule.day_of_week,
			}));

			setClasses(transformedData);
		} catch (error) {
			console.error("Error fetching classes:", error);
		}
	};

	useEffect(() => {
		fetchClasses();
	}, []);
	return (
		<div className="min-h-screen">
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="student" element={<StudentPage initialData={classes} />} />
				<Route path="lecturer" element={<LecturerPage />} />
				<Route path="/admin" element={<AdminPage />}>
					<Route index element={<Adminmain />} />
					<Route path="departments" element={<DepartmentsPage />} />
					<Route path="lecturers" element={<LecturersPage />} />
					<Route path="courses" element={<CoursesPage />} />
					<Route path="batches" element={<BatchesPage />} />
					<Route path="subjects" element={<SubjectsPage />} />
					<Route path="rooms" element={<RoomsPage />} />
					<Route path="classes" element={<ClassesPage initialData={classes} />} />
					</Route>
			</Routes>
		</div>
	);
};

export default App;
