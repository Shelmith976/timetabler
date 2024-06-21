import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";

import DataTable from "../components/DataTable";
import { getCourses, getDepartments, deleteCourse } from "../api";
import Modal from "../components/Modal";
import AddCourseForm from "./AddCourseForm";

const columns = ["SNO", "course_name", "department_name"];

const Courses = () => {
	const [showAddModal, setShowAddModal] = useState(false);
	const [courses, setCourses] = useState([]);
	const [editCourse, setEditCourse] = useState(null);
	const { search } = useLocation();

	const fetchCoursesAndDepartments = async () => {
		try {
			const departmentsData = await getDepartments();
			const coursesData = await getCourses();
			const transformedData = coursesData.data.map((course, index) => {
				const course_dept = departmentsData.data.find(
					(dept) => dept.department_id === course.department_id,
				);
				return {
					SNO: index + 1,
					course_id: course.course_id,
					course_name: course.course_name,
					department_name: course_dept
						? course_dept.department_name
						: "No department",
				};
			});

			setCourses(transformedData);
		} catch (error) {
			console.error("Error fetching courses:", error);
		}
	};
	useEffect(() => {
		fetchCoursesAndDepartments();
	}, [search, showAddModal]);

	const editItem = (item) => {
		const selectedCourse = courses.find(
			(crs) => crs.course_id === item.course_id,
		);
		setShowAddModal(true);
		setEditCourse(selectedCourse);
	};

	const deleteItem = async (item) => {
		try {
			const res = await deleteCourse(item.course_id);

			// Fetch updated data after deletion
			await fetchCoursesAndDepartments();
		} catch (error) {
			console.error("Error deleting course:", error);
		}
	};

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-between mt-6">
				<h1 className="text-lg font-bold text-gray-800">Courses' List</h1>
				<button
					onClick={() => setShowAddModal(true)}
					className="inline-flex gap-2.5 items-center px-5 py-2.5 font-semibold my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
					<MdPersonAdd size={24} />
					<span>Add Course</span>
				</button>
			</div>
			{showAddModal ? (
				<div className="fixed top-0 left-0 w-full h-full bg-primary-black opacity-10 backdrop-blur z-[999] hidden"></div>
			) : (
				<div className="min-w-0  my-6 overflow-hidden bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 ">
					<div className="p-4">
						{/* Pass the courses data to the DataTable component */}
						<DataTable
							columns={columns}
							data={courses}
							editItem={editItem}
							deleteItem={deleteItem}
						/>
					</div>
				</div>
			)}
			,
			<Modal
				show={showAddModal}
				onClose={() => {
					setShowAddModal(false);
					setEditCourse(null);
				}}
				content={
					<AddCourseForm
						onClose={() => setShowAddModal(false)}
						editCourse={editCourse}
					/>
				}
			/>
		</section>
	);
};

export default Courses;
