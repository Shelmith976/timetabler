import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";

import DataTable from "../components/DataTable";
import {deleteBatch, getBatches ,getCourses} from "../api";
import Modal from "../components/Modal";
import AddBatchForm from "./AddBatchForm";

const columns = [
	"SNO",
	"batch_code",
	"batch_name",
	"course_name",
	"year",
	"semester",
	"batch_size",

];

const Batches = () => {
	const [showAddModal, setShowAddModal] = useState(false);
	const [batches, setBatches] = useState([]);
	const [editbatch, setEditBatch] = useState([null]);

	const { search } = useLocation();
	const fetchBatchesAndCourses = async () => {
		try {
			const batchesData = await getBatches();
			const coursesData = await getCourses();
			const transformedData =
				batchesData.data.map( (batch, index) => {
					const bat_course =coursesData.data.find((crs)=>crs.course_id === batch.course_id)
					return {
						SNO: index + 1,
						batch_id:batch.batch_id,
						batch_code: batch.batch_code,
						batch_name: batch.batch_name,
						course_name: bat_course ? bat_course.course_name : "No course",
						year: batch.year,
						semester: batch.semester,
						batch_size: batch.batch_size,

					};
				});
			

			setBatches(transformedData);
		} catch (error) {
			console.error("Error fetching batches:", error);
		}
	};
	useEffect(() => {
		fetchBatchesAndCourses();
	}, [search, showAddModal]);

	
	const editItem = (item) => {
		const selectedBatch = batches.find(
			(bat) => bat.batch_id === item.batch_id,
		);
		setShowAddModal(true);
		setEditBatch(selectedBatch);
	};
	const deleteItem = async (item) => {
		try {
			// Assuming you have a deleteDepartment function in your api.js
			await deleteBatch(item.batch_id);

			// Fetch updated data after deletion
			await fetchBatchesAndCourses();
		} catch (error) {
			console.error("Error deleting batch:", error);
		}
	};

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-between mt-6">
				<h1 className="text-lg font-bold text-gray-800">Batches' List</h1>
				<button
					onClick={() => setShowAddModal(true)}
					className="inline-flex gap-2.5 items-center px-5 py-2.5 font-semibold my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
					<MdPersonAdd size={24} />
					<span>Add Batch</span>
				</button>
			</div>
			{showAddModal ? (
				<div className="fixed top-0 left-0 w-full h-full bg-primary-black opacity-10 backdrop-blur z-[999] hidden"></div>
			) : (
				<div className="min-w-0  my-6 overflow-hidden bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 ">
					<div className="p-4">
						{/* Pass the batches data to the DataTable component */}
						<DataTable
							columns={columns}
							data={batches}
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
					setEditBatch(null);
				}}
				content={
					<AddBatchForm
						onClose={() => setShowAddModal(false)}
						editBatch={editbatch}
					/>
				}
			/>
		</section>
	);
};

export default Batches;
