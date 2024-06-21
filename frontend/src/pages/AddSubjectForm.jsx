import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdBackspace, MdLocalDining, MdPersonAdd } from "react-icons/md";
import {
	addSubject,
	getCourses,
	getBatchesByCourse,
	updateSubject,
} from "../api";

const AddSubjectForm = ({ onClose, editSubject }) => {
	const [loading, setLoading] = useState(false);
	const [selectedCourseId, setSelectedCourseId] = useState();
	const [courses, setCourses] = useState([]);
	const [batches, setBatches] = useState([]);
	const [subjectCode, setSubjectCode] = useState("");
	const [subjectName, setSubjectName] = useState("");

	const fetchCourses = async () => {
		try {
			const response = await getCourses();
			setCourses(response.data);
		} catch (error) {
			console.error("Error fetching course names:", error.message);
		}
	};

	const fetchBatches = async (courseId) => {
		try {
			const response = await getBatchesByCourse(courseId);
			if (response.data && response.data.data) {
				setBatches(response.data.data);
			} else {
				setBatches([]);
			}
		} catch (error) {
			console.error("Error fetching batches:", error.message);
			setBatches([]);
		}
	};

	useEffect(() => {
		fetchBatches(selectedCourseId);
	}, [selectedCourseId]);

	const changeSelectOptionHandler = (event) => {
		const courseId = event.target.value;
		setSelectedCourseId(courseId);
	};

	useEffect(() => {
		if (editSubject) {
			setSubjectCode(editSubject.subject_code);
			setSubjectName(editSubject.subject_name);
			setSelectedCourseId(editSubject.course_id);
			fetchBatches(editSubject.course_id);
		}
		fetchCourses();
	}, [editSubject]);

	const {
		handleSubmit,
		formState: { errors },
		register,
		reset,
	} = useForm({
		defaultValues: {
			subject_code: "",
			subject_name: "",
			has_lab: "",
			course_id: "",
			batch_id: "",
		},
	});

	const onSubmit = async (data) => {
		editSubject ? handleUpdate(data) : handleAdd(data);
	};

	const handleAdd = async (data) => {
		try {
			setLoading(true);
			await addSubject(data);
			alert("Subject details added successfully");
			reset();
			onClose();
		} catch (error) {
			console.error("Error adding subject:", error.message);
			alert("Error adding subject details");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (data) => {
		try {
			setLoading(true);
			await updateSubject(editSubject.subject_id, data);
			alert("Subject details updated successfully");
			reset();
			onClose();
		} catch (error) {
			console.error("Error updating subject:", error.message);
			alert("Error updating subject details");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="relative w-[80vw] md:w-[50vw] md:min-w-[600px] border-2 bg-gray-50 flex flex-col justify-between border-dark-green p-0 rounded-md">
			<div className="relative flex items-center justify-between w-full border-b border-gray-100 dark:border-gray-700 ">
				<div className="bg-dark-green/80 w-full text-center p-3">
					<h4 className="text-xl font-semibold text-white">
						{editSubject ? "Update Subject Details" : "Add New Subject"}
					</h4>
					<p className="pt-2 mb-0 text-sm text-gray-50">
						{editSubject
							? "Edit the necessary subject information here"
							: "Add the necessary subject information here"}
					</p>
				</div>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-7">
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.subject_code
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none focus-within:bg-white rounded`}
							{...register("subject_code", { required: true })}
							placeholder="Enter subject code"
							value={subjectCode}
							onChange={(e) => setSubjectCode(e.target.value)}
						/>
					</div>

					<div className="flex-1 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.subject_name
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none focus-within:bg-white rounded`}
							{...register("subject_name", { required: true })}
							placeholder="Enter subject name"
							value={subjectName}
							onChange={(e) => setSubjectName(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<div className="flex items-center space-x-2">
							<input
								type="radio"
								id="has_lab_true"
								value="1"
								className="peer hidden"
								{...register("has_lab", { required: true })}
								aria-invalid={errors.has_lab ? "true" : "false"}
							/>
							<label
								htmlFor="has_lab_true"
								className={`w-1/2 p-2 text-primary-black select-none capitalize bg-gray-50 border peer-checked:border-2 peer-checked:border-b-0 ${
									errors.has_lab
										? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
										: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
								} focus:outline-none focus-within:bg-white rounded`}>
								Has lab
							</label>

							<input
								type="radio"
								id="has_lab_false"
								value="0"
								className="peer hidden"
								{...register("has_lab", { required: true })}
								aria-invalid={errors.has_lab ? "true" : "false"}
							/>
							<label
								htmlFor="has_lab_false"
								className={`w-1/2 p-2 text-primary-black select-none capitalize bg-gray-50 border peer-checked:border-2 peer-checked:border-b-0 ${
									errors.has_lab
										? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
										: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
								} focus:outline-none focus-within:bg-white rounded`}>
								No lab
							</label>
						</div>

						{errors.has_lab?.type === "required" && (
							<p role="alert" className="text-dark-orange">
								Lab status is required
							</p>
						)}
					</div>

					<div className="flex-1 my-3.5">
						<select
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.course_id
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none focus-within:bg-white rounded`}
							{...register("course_id", { required: true })}
							onChange={changeSelectOptionHandler}
							aria-invalid={errors.course_id ? "true" : "false"}
							value={selectedCourseId}>
							<option value="" disabled>
								Select Course
							</option>
							{courses?.map((option) => (
								<option key={option.course_id} value={option.course_id}>
									{option.course_name}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<select
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.batch_id
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none focus-within:bg-white rounded`}
							{...register("batch_id", { required: true })}
							aria-invalid={errors.batch_id ? "true" : "false"}>
							<option value="" disabled>
								Select Batch
							</option>
							{batches.map((batch) => (
								<option key={batch.batch_id} value={batch.batch_id}>
									{batch.batch_name}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="flex justify-center mt-6">
					<button
						type="submit"
						className="px-4 py-2 text-white bg-dark-green rounded-md hover:bg-opacity-80"
						disabled={loading}>
						{loading ? "Saving..." : "Save"}
					</button>
					<button
						type="button"
						className="px-4 py-2 ml-4 text-white bg-red-600 rounded-md hover:bg-opacity-80"
						onClick={onClose}>
						Cancel
					</button>
				</div>
			</form>
		</section>
	);
};

export default AddSubjectForm;
