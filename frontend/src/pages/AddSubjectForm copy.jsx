import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdBackspace, MdLocalDining, MdPersonAdd } from "react-icons/md";
import { addSubject, getCourses,getBatches, updateSubject } from "../api";

const AddSubjectForm = ({ onClose, editSubject }) => {
	const [loading, setLoading] = useState(false);
	const [courses, setCourses] = useState([]);
	const [course_name, setCourseName] = useState([]);
	const [subject_code, setSubjectCode] = useState([]);
	const [subject_name, setSubjectName] = useState([]);
	const [batches, setBatches] = useState([]);



	const fetchCourses = async () => {
		try {
			const courseNames = await getCourses();
			setCourses(courseNames.data);
		} catch (error) {
			console.error("Error fetching course names:", error.message);
		}
	};

	useEffect(() => {
		if (editSubject) {
			setSubjectCode(editSubject.subject_code);
			setSubjectName(editSubject.subject_name);
			setCourseName(editSubject.course_name);
		}
		fetchCourses();
	}, [editSubject]);
	const {
		handleSubmit,
		formState: { errors },
		register,
		reset,
		control,
	} = useForm({
		defaultValues: {
			subject_code: "",
			subject_name: "",
			has_lab: "",
			course_name: "",
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
			alert("Error adding subject details ");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (data) => {
		if (editSubject) {
			await updateSubject(editSubject.subject_id, data);
		} else {
			await addSubject(data);
		}
		onClose();
	};

	useEffect(() => {
		// Fetch course names from the database
		const fetchCourses = async () => {
			try {
				const courseNames = await getCourses();
				setCourses(courseNames.data);
			} catch (error) {
				console.error("Error fetching course names:", error.message);
			}
		};

		fetchCourses();
	}, []);
	useEffect(() => {
		// Fetch course names from the database
		const fetchBatches = async () => {
			try {
				const batchCodes = await getBatches();
				setBatches(batchCodes.data);
			} catch (error) {
				console.error("Error fetching batch codes:", error.message);
			}
		};

		fetchBatches();
	}, []);

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
			<form action="" onSubmit={handleSubmit(onSubmit)} className="mt-6 p-7">
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.subject_code
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("subject_code", { required: true })}
							placeholder="Enter subject code"
							value={subject_code}
							onChange={(e) => setSubjectCode(e.target.value)}
						/>
					</div>

					<div className="flex-1 my-3.5">
						<input
							type="text"
							// id="subject_name"
							// label="Subject Name"
							// placeholder="Enter subject name"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.subject_name
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("subject_name", { required: true })}
							placeholder="Enter subject name"
							value={subject_name}
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
								value="0"
								className="peer hidden"
								checked
								{...register("has_lab", { required: true })}
								aria-invalid={errors.has_lab ? "true" : "false"}
							/>
							<label
								htmlFor="has_lab_true"
								className={`w-1/2 p-2 text-primary-black select-none capitalize bg-gray-50 border peer-checked:border-2 peer-checked:border-b-0 ${
									errors.course
										? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
										: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
								} focus:outline-none  focus-within:bg-white rounded`}>
								Has lab
							</label>

							<input
								type="radio"
								id="has_lab_false"
								value="1"
								className="peer hidden"
								{...register("has_lab", { required: true })}
								aria-invalid={errors.has_lab ? "true" : "false"}
							/>
							<label
								htmlFor="has_lab_false"
								className={`w-1/2 p-2 text-primary-black select-none capitalize bg-gray-50 border peer-checked:border-2 peer-checked:border-b-0 ${
									errors.course
										? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
										: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
								} focus:outline-none  focus-within:bg-white rounded`}>
								Has no lab
							</label>
						</div>

						{errors.has_lab?.type === "required" && (
							<p role="alert" className="text-dark-orange">
								Has lab is required
							</p>
						)}
					</div>

					<div className="flex-1 my-3.5">
						<select
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.course_id
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("course_id", { required: true })}
							aria-invalid={errors.course_id ? "true" : "false"}>
							<option value="" disabled selected>
								Select Course
							</option>
							{courses?.map((option, index) => (
								<option key={index} value={option.course_id}>
									{option.course_name}
								</option>
							))}
						</select>
					</div>
					<div className="flex-1 my-3.5">
						<select
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.batch_id
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("batch_id", { required: true })}
							aria-invalid={errors.batch_id ? "true" : "false"}>
							<option value="" disabled selected>
								Select batch
							</option>
							{batches?.map((option, index) => (
								<option key={index} value={option.batch_id}>
									{option.batch_code}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="relative flex flex-col items-center justify-between w-full p-6 mt-6 space-y-3  sm:flex-row sm:space-x-14   ">
					<button
						disabled={loading}
						onClick={onClose}
						className=" inline-flex gap-2.5 items-center px-4 py-2 text-white rounded bg-dark-orange/80 capitalize text-lg font-normal transition ease-in-out duration-500 hover:bg-dark-orange">
						<MdBackspace />
						Cancel
					</button>

					<button
						disabled={loading}
						type="submit"
						className=" inline-flex gap-2.5 items-center px-4 py-2 rounded text-white bg-dark-green/80 disabled:text-white capitalize !text-lg font-normal transition ease-in-out duration-500 hover:bg-dark-green">
						{loading ? (
							<MdLocalDining size={20} className="!text-white animate-spin" />
						) : (
							<MdPersonAdd />
						)}
						Add Subject
					</button>
				</div>
			</form>
		</section>
	);
};

export default AddSubjectForm;
