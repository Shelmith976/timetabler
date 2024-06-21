import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";

import DataTable from "../components/DataTable";
import { getSubjects, deleteSubject, getCourses } from "../api";
import Modal from "../components/Modal";
import AddSubjectForm from "./AddSubjectForm";

const columns = [
	"SNO",
	"subject_code",
	"subject_name",
	"has_lab",
	"course_name",
];

const Subjects = () => {
	const [showAddModal, setShowAddModal] = useState(false);
	const [subjects, setSubjects] = useState([]);
	const [editSubject, setEditSubject] = useState([null]);

	const { search } = useLocation();

	const fetchSubjectsAndCourses = async () => {
		try {
			const subjectsData = await getSubjects();
			const coursesData = await getCourses();

			const transformedData = subjectsData.data.map((subject, index) => {
				const subj_course = coursesData.data.find(
					(crs) => crs.course_id === subject.course_id,
				);

				return {
					SNO: index + 1,
					subject_id: subject.subject_id,
					subject_code: subject.subject_code,
					subject_name: subject.subject_name,
					has_lab: subject.has_lab,
					course_name: subj_course ? subj_course.course_name : "No course",
				};
			});

			setSubjects(transformedData);
		} catch (error) {
			console.error("Error fetching subjects:", error);
		}
	};
	useEffect(() => {
		fetchSubjectsAndCourses();
	}, [search, showAddModal]);

	const editItem = (item) => {
		const selectedSubject = subjects.find(
			(sub) => sub.subject_id === item.subject_id,
		);
		setShowAddModal(true);
		setEditSubject(selectedSubject);
	};

	const deleteItem = async (item) => {
		try {
			// Assuming you have a deleteDepartment function in your api.js
			await deleteSubject(item.subject_id);

			// Fetch updated data after deletion
			await fetchSubjectsAndCourses();
		} catch (error) {
			console.error("Error deleting batch:", error);
		}
	};

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-between mt-6">
				<h1 className="text-lg font-bold text-gray-800">Subjects' List</h1>
				<button
					onClick={() => setShowAddModal(true)}
					className="inline-flex gap-2.5 items-center px-5 py-2.5 font-semibold my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
					<MdPersonAdd size={24} />
					<span>Add Subject</span>
				</button>
			</div>
			{showAddModal ? (
				<div className="fixed top-0 left-0 w-full h-full bg-primary-black opacity-10 backdrop-blur z-[999] hidden"></div>
			) : (
				<div className="min-w-0  my-6 overflow-hidden bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 ">
					<div className="p-4">
						{/* Pass the subjects data to the DataTable component */}
						<DataTable
							columns={columns}
							data={subjects}
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
					setEditSubject(null);
				}}
				content={
					<AddSubjectForm
						onClose={() => setShowAddModal(false)}
						editSubject={editSubject}
					/>
				}
			/>
		</section>
	);
};

export default Subjects;
