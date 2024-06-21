import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";

import DataTable from "../components/DataTable";
import { deleteLecturer, getLecturers, getDepartments } from "../api";
import Modal from "../components/Modal";
import AddLecturerForm from "./AddLecturerForm";

const columns = [
	"SNO",
	"staff_no",
	"first_name",
	"last_name",
	"department_name",
	"preferred_days",
];

const Lecturers = () => {
	const [showAddModal, setShowAddModal] = useState(false);
	const [lecturers, setLecturers] = useState([]);
	const [editLecturer, setEditLecturer] = useState(null);
	const { search } = useLocation();
	const fetchLecturersAndDepartments = async () => {
		try {
			const departmentsData = await getDepartments();
			const lecturersData = await getLecturers();

			const transformedData = lecturersData.data.map((lecturer, index) => {
				const lecturer_dept = departmentsData.data.find(
					(dept) => dept.department_id === lecturer.department_id,
				);

				return {
					SNO: index + 1,
					lecturer_id: lecturer.lecturer_id,
					staff_no: lecturer.staff_no,
					first_name: lecturer.first_name,
					last_name: lecturer.last_name,
					department_name: lecturer_dept
						? lecturer_dept.department_name
						: "No department",
					preferred_days: lecturer.preferred_days,
				};
			});
			setLecturers(transformedData);
		} catch (error) {
			console.error("Error fetching lecturers:", error);
		}
	};
	useEffect(() => {
		fetchLecturersAndDepartments();
	}, [search, showAddModal]);

	const editItem = (item) => {
		const selectedLecturer = lecturers.find(
			(lec) => lec.lecturer_id === item.lecturer_id,
		);
		setShowAddModal(true);
		setEditLecturer(selectedLecturer);
	};

	const deleteItem = async (item) => {
		try {
			// Assuming you have a deleteDepartment function in your api.js
			await deleteLecturer(item.lecturer_id);

			// Fetch updated data after deletion
			await fetchLecturersAndDepartments();
		} catch (error) {
			console.error("Error deleting department:", error);
		}
	};

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-between mt-6">
				<h1 className="text-lg font-bold text-gray-800">Lecturers' List</h1>
				<button
					onClick={() => setShowAddModal(true)}
					className="inline-flex gap-2.5 items-center px-5 py-2.5 font-semibold my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
					<MdPersonAdd size={24} />
					<span>Add Lecturer</span>
				</button>
			</div>
			{showAddModal ? (
				<div className="fixed top-0 left-0 w-full h-full bg-primary-black opacity-10 backdrop-blur z-[999] hidden"></div>
			) : (
				<div className="min-w-0  my-6 overflow-hidden bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 ">
					<div className="p-4">
						{/* Pass the lecturers data to the DataTable component */}
						<DataTable
							columns={columns}
							data={lecturers}
							editItem={editItem}
							deleteItem={deleteItem}
						/>
					</div>
				</div>
			)}
			<Modal
				show={showAddModal}
				onClose={() => {
					setShowAddModal(false);
					setEditLecturer(null);
				}}
				content={
					<AddLecturerForm
						onClose={() => setShowAddModal(false)}
						editLecturer={editLecturer}
					/>
				}
			/>
		</section>
	);
};

export default Lecturers;
