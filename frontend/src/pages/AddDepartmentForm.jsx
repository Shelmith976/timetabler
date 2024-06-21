import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { addDepartment, updateDepartment } from "../api";
import { MdBackspace, MdLocalDining, MdPersonAdd } from "react-icons/md";

const AddDepartmentForm = ({ onClose, editDepartment }) => {
	const [loading, setLoading] = useState(false);

	const [department_code, setDepartmentCode] = useState("");
	const [department_name, setDepartmentName] = useState("");

	useEffect(() => {
		if (editDepartment) {
			setDepartmentCode(editDepartment.department_code);
			setDepartmentName(editDepartment.department_name);
		}
	}, [editDepartment]);

	const {
		handleSubmit,
		formState: { errors },
		register,
		reset,
		control,
	} = useForm({
		defaultValues: {
			department_code: "",
			department_name: "",
		},
	});

	const onSubmit = async (data) => {
		editDepartment ? handleUpdate(data) : handleAdd(data);
	};

	const handleAdd = async (data) => {
		try {
			setLoading(true);
			await addDepartment(data);
			alert("Department details added successfully");
			reset();
			onClose();
		} catch (error) {
			console.error("Error adding department:", error.message);
			alert("Error adding department details ");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (data) => {
		if (editDepartment) {
			await updateDepartment(editDepartment.department_id, data);
		} else {
			await addDepartment(data);
		}
		onClose();
	};

	return (
		<section className="relative w-[80vw] md:w-[50vw] md:min-w-[600px] border-2 bg-gray-50 flex flex-col justify-between border-dark-green p-0 rounded-md">
			<div className="relative flex items-center justify-between w-full border-b border-gray-100 dark:border-gray-700 ">
				<div className="bg-dark-green/80 w-full text-center p-3">
					<h4 className="text-xl font-semibold text-white">
						{editDepartment
							? "Update Department Details"
							: "Add New Department"}
					</h4>
					<p className="pt-2 mb-0 text-sm text-gray-50">
						{editDepartment
							? "Edit the necessary department information here"
							: "Add the necessary department information here"}
					</p>
				</div>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-7">
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black uppercase bg-gray-50 border placeholder:capitalize ${
								errors.department_code
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("department_code", { required: true })}
							placeholder="Enter department code"
							value={department_code}
							onChange={(e) => setDepartmentCode(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.department_name
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("department_name", { required: true })}
							placeholder="Enter department name"
							value={department_name}
							onChange={(e) => setDepartmentName(e.target.value)}
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
						disabled={loading}
						type="submit"
						className=" inline-flex gap-2.5 items-center px-4 py-2 rounded text-white bg-dark-green/80 disabled:text-white capitalize !text-lg font-normal transition ease-in-out duration-500 hover:bg-dark-green">
						{loading ? (
							<MdLocalDining size={20} className="!text-white animate-spin" />
						) : (
							<MdPersonAdd />
						)}

						{editDepartment ? "Update Department" : "Add Department"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AddDepartmentForm;
