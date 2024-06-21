import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdBackspace, MdLocalDining, MdPersonAdd } from "react-icons/md";
import { addLecturer, getDepartments, updateLecturer } from "../api";

const AddLecturerForm = ({ onClose, editLecturer }) => {
	const [loading, setLoading] = useState(false);
	const [lecturer_id, setLecturerId] = useState("");
	const [staff_no, setStaffNo] = useState("");
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [department_name, setDepartmentName] = useState([]);
	const [preferred_days, setPreferredDdays] = useState([]);
	const [options, setOptions] = useState("");
	const [department_id, setDepartmentId] = useState("");
	const [departments, setDepartments] = useState([]);
	const fetchDepartments = async () => {
		try {
			const departmentNames = await getDepartments();
			setDepartments(departmentNames.data);
		} catch (error) {
			console.error("Error fetching course names:", error.message);
		}
	};

	useEffect(() => {
		if (editLecturer) {
			setStaffNo(editLecturer.staff_no);
			setFirstName(editLecturer.first_name);
			setLastName(editLecturer.last_name);
			setDepartmentName(editLecturer.department_name);
			setPreferredDdays(editLecturer.preferred_days);
		}
		fetchDepartments();
	}, [editLecturer]);
	const {
		handleSubmit,
		formState: { errors },
		register,
		reset,
		control,
	} = useForm({
		defaultValues: {
			staff_no: "",
			first_name: "",
			last_name: "",
			department_name: "",
			preferred_days: "",
		},
	});

	const onSubmit = async (data) => {
		editLecturer ? handleUpdate(data) : handleAdd(data);
	};
	const handleAdd = async (data) => {
		try {
			setLoading(true);
			await addLecturer(data);
			alert("Lecturer details added successfully");
			reset();
			onClose();
		} catch (error) {
			console.error("Error adding lecturer:", error.message);
			alert("Error adding lecturer details ");
		} finally {
			setLoading(false);
		}
	};
	const handleUpdate = async (data) => {
		if (editLecturer) {
			await updateLecturer(editLecturer.lecturer_id, data);
		} else {
			await addLecturer(data);
		}
		onClose();
	};

	return (
		<section className="relative w-[80vw] md:w-[50vw] md:min-w-[600px] border-2 bg-gray-50 flex flex-col justify-between border-dark-green p-0 rounded-md">
			<div className="relative flex items-center justify-between w-full border-b border-gray-100 dark:border-gray-700 ">
				<div className="bg-dark-green/80 w-full text-center p-3">
					<h4 className="text-xl font-semibold text-white">
						{editLecturer ? "Update Lecturer Details" : "Add New Lecturer"}
					</h4>
					<p className="pt-2 mb-0 text-sm text-gray-50">
						{editLecturer
							? "Edit the necessary Lecturer information here"
							: "Add the necessary Lecturer information here"}
					</p>
				</div>
			</div>
			<form action="" onSubmit={handleSubmit(onSubmit)} className="mt-6 p-7">
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${errors.staff_no
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
								} focus:outline-none  focus-within:bg-white rounded`}
							{...register("staff_no", { required: true })}
							placeholder="Enter staff number"
							value={staff_no}
							onChange={(e) => setStaffNo(e.target.value)}
						/>
					</div>
					<div className="flex-1 my-5">
						<select
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${errors.department_id
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
								} focus:outline-none  focus-within:bg-white rounded`}
							{...register("department_id", { required: true })}
							aria-invalid={errors.department_id ? "true" : "false"}
							value={department_id}
							onChange={(e) => setDepartmentId(e.target.value)}>
							<option value="" disabled>
								Select Department
							</option>
							{departments?.map((option, index) => (
								<option key={index} value={option.department_id}>
									{option.department_name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${errors.first_name
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
								} focus:outline-none  focus-within:bg-white rounded`}
							{...register("first_name", { required: true })}
							placeholder="Enter first name"
							value={first_name}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>

					<div className="flex-1 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${errors.last_name
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
								} focus:outline-none  focus-within:bg-white rounded`}
							{...register("last_name", { required: true })}
							placeholder="Enter last name"
							value={last_name}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">

				<div className="flex-1 my-3.5">
					<input
						type="text"
						className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${errors.preferred_days
								? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
								: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
						{...register("preferred_days", { required: true })}
						placeholder="Enter lecturer preferred_days"
						value={preferred_days}
						onChange={(e) => setPreferredDdays(e.target.value)}
					/>

				</div>
				</div>
				<div className="relative flex flex-col items-center justify-between w-full p-6 mt-6 space-y-3  sm:flex-row sm:space-x-14   ">
					<button
						type="submit"
						className="px-4 py-2 bg-dark-green text-white rounded-md hover:bg-dark-green-hover focus:outline-none focus:bg-dark-green-hover">
						{editLecturer ? "Update lecturer" : "Add lecturer"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AddLecturerForm;
