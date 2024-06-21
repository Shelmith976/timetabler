import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";

import DataTable from "../components/DataTable";
import { deleteDepartment, getDepartments } from "../api";
import Modal from "../components/Modal";
import AddDepartmentForm from "./AddDepartmentForm";

const columns = ["SNO", "department_code", "department_name"];

const Departments = () => {
	const [showAddModal, setShowAddModal] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [editDepartment, setEditDepartment] = useState(null);

	const { search } = useLocation();

	const fetchDepartments = async () => {
		try {
			const departmentsData = await getDepartments();
			const transformedData = departmentsData.data.map((dept, index) => ({
				SNO: index + 1,
				department_id: dept.department_id,
				department_code: dept.department_code,
				department_name: dept.department_name,
			}));
			setDepartments(transformedData);
		} catch (error) {
			console.error("Error fetching departments:", error);
		}
	};

	useEffect(() => {
		fetchDepartments();
	}, [search, showAddModal]);

	const editItem = (item) => {
		const selectedDepartment = departments.find(
			(dept) => dept.department_id === item.department_id,
		);
		setShowAddModal(true);
		setEditDepartment(selectedDepartment);
	};

	const deleteItem = async (item) => {
		try {
			await deleteDepartment(item.department_id);

			// Fetch updated data after deletion
			await fetchDepartments();
		} catch (error) {
			console.error("Error deleting department:", error);
		}
	};

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-between mt-6">
				<h1 className="text-lg font-bold text-gray-800">Department' List</h1>
				<button
					onClick={() => setShowAddModal(true)}
					className="inline-flex gap-2.5 items-center px-5 py-2.5 font-semibold my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
					<MdPersonAdd size={24} />
					<span>Add Department</span>
				</button>
			</div>
			{showAddModal ? (
				<div className="fixed top-0 left-0 w-full h-full bg-primary-black opacity-10 backdrop-blur z-[999] hidden"></div>
			) : (
				<div className="min-w-0  my-6 overflow-hidden bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5">
					<div className="p-4">
						<DataTable
							columns={columns}
							data={departments}
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
					setEditDepartment(null);
				}}
				content={
					<AddDepartmentForm
						onClose={() => setShowAddModal(false)}
						editDepartment={editDepartment}
					/>
				}
			/>
		</section>
	);
};

export default Departments;
