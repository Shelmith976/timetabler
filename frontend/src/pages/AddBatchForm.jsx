import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdBackspace, MdLocalDining, MdPersonAdd } from "react-icons/md";
import { addBatch,updateBatch, getCourses } from "../api";

const AddBatchForm = ({ onClose, editBatch }) => {
	const [loading, setLoading] = useState(false);
	const [batch_code, setBatchCode] = useState([]);
	const [batch_name, setBatchName] = useState([]);
	const [course_name, setCourseName]= useState([]);
	const [year, setYear] = useState([]);
	const [semester, setSemester] = useState([]);
	const [batch_size, setBatchSize] = useState([]);
	const [course_id, setCourseId] = useState("");
	const [courses, setCourses] =useState([])
	const [options, setOptions]= useState("");


	const fetchCourses = async () => {
		try {
			const courseNames = await getCourses();
			setCourses(courseNames.data);
		} catch (error) {
			console.error("Error fetching course names:", error.message);
		}
	};
	useEffect(() => {
		if (editBatch) {
			setBatchCode(editBatch.batch_code);
			setBatchName(editBatch.batch_name);
			setCourseName(editBatch.course_name)
			setYear(editBatch.year);
			setSemester(editBatch.semester);
			setBatchSize(editBatch.batch_size)
		}
		fetchCourses();
	}, [editBatch]);
	const {
		handleSubmit,
		formState: { errors },
		register,
		reset,
		control,
	} = useForm({
		defaultValues: {
			batch_code:"",
			batch_name:"",
			course_name: "",
			year:"",
			semester:"",
			batch_size:"",	
			},
	});


	const onSubmit = async (data) => {
		editBatch ? handleUpdate(data) : handleAdd(data);
	};
	const handleAdd = async (data) => {
		try {
			setLoading(true);
			await addBatch(data);
			alert("Batch details added successfully");
			reset();
			onClose();
		} catch (error) {
			console.error("Error adding batch:", error.message);
			alert("Error adding batch details ");
		} finally {
			setLoading(false);
		}
	};
	const handleUpdate = async (data) => {
		if (editBatch) {
			await updateBatch(editBatch.batch_id, data);
		} else {
			await addBatch(data);
		}
		onClose();
	};

	return (
		<section className="relative w-[80vw] md:w-[50vw] md:min-w-[600px] border-2 bg-gray-50 flex flex-col justify-between border-dark-green p-0 rounded-md">
			<div className="relative flex items-center justify-between w-full border-b border-gray-100 dark:border-gray-700 ">
				<div className="bg-dark-green/80 w-full text-center p-3">
				<h4 className="text-xl font-semibold text-white">
						{editBatch
							? "Update Batch Details"
							: "Add New Batch"}
					</h4>
					<p className="pt-2 mb-0 text-sm text-gray-50">
						{editBatch
							? "Edit the necessary batch information here"
							: "Add the necessary batch information here"}
					</p>
				</div>
			</div>
			<form action="" onSubmit={handleSubmit(onSubmit)} className="mt-6 p-7">
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							// id="batch_name"
							// label="Batch Name"
							// placeholder="Enter batch name"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.batch_code
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("batch_code", { required: true })}
							placeholder="Enter batch code"
							value={batch_code}
							onChange={(e) => setBatchCode(e.target.value)}
						/>
					</div>
					<div className="flex-1 my-3.5">
						<input
							type="text"
							// id="year"
							// label="Year of study number"
							// placeholder="Enter year of study"
							className={`w-full p-2 text-primary-black bg-gray-50 border ${
								errors.batch_name
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("batch_name", { required: true })}
							placeholder="Enter batch name"
							value={batch_name}
							onChange={(e) => setBatchName(e.target.value)}
						/>
					</div>
					</div>

					<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">

											<select
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.course_id
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("course_id", { required: true })}
							aria-invalid={errors.course_id ? "true" : "false"}
							value={course_id}
							onChange={(e) => setCourseId(e.target.value)}>
							<option value="" disabled>
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
						<input
							type="number"
							// id="semester"
							// label="Semester of study number"
							// placeholder="Enter semester of study"
							className={`w-full p-2 text-primary-black bg-gray-50 border ${
								errors.year
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("year", { required: true })}
							placeholder="Enter year "
							value={year}
							onChange={(e) => setYear(e.target.value)}
							/>
					</div>
</div>
<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							// id="semester"
							// label="Semester of study number"
							// placeholder="Enter semester of study"
							className={`w-full p-2 text-primary-black bg-gray-50 border ${
								errors.semester
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("semester", { required: true })}
							placeholder="Enter semester "
							value={semester}
							onChange={(e) => setSemester(e.target.value)}
							/>
					</div>
				<div className="flex-1 my-3.5">
						<input
							type="text"
							// id="semester"
							// label="Semester of study number"
							// placeholder="Enter semester of study"
							className={`w-full p-2 text-primary-black bg-gray-50 border ${
								errors.batch_size
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("batch_size", { required: true })}
							placeholder="Enter batch size "
							value={batch_size}
							onChange={(e) => setBatchSize(e.target.value)}
							/>
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
						type="submit"
						className="px-4 py-2 bg-dark-green text-white rounded-md hover:bg-dark-green-hover focus:outline-none focus:bg-dark-green-hover">
						{editBatch ? "Update Batch" : "Add Batch"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AddBatchForm;
