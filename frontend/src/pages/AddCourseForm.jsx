import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { addCourse, getDepartments, updateCourse } from "../api";
import { MdBackspace } from "react-icons/md";

const AddCourseForm = ({ onClose, editCourse }) => {
	const [loading, setLoading] = useState(false);
	// const [courses, setCourses] = useState([]);

	const [course_name, setCourseName] = useState("");
	const [department_id, setDepartmentId] = useState("");
	const [departments, setDepartments] = useState([]);

	// Fetch course names from the database
	const fetchDepartments = async () => {
		try {
			const departmentNames = await getDepartments();
			setDepartments(departmentNames.data);
		} catch (error) {
			console.error("Error fetching course names:", error.message);
		}
	};

	useEffect(() => {
		if (editCourse) {
			setCourseName(editCourse.course_name);
			setDepartmentId(editCourse.department_id);
		}
		fetchDepartments();
	}, [editCourse]);

	const {
		handleSubmit,
		formState: { errors },
		register,
		reset,
		control,
	} = useForm({
		defaultValues: {
			course_name: "",
			department_id: "",
		},
	});
	const onSubmit = async (data) => {
		editCourse ? handleUpdate(data) : handleAdd(data);
	};

	const handleAdd = async (data) => {
		try {
			setLoading(true);
			await addCourse(data);
			alert("Course details added successfully");
			reset();
			onClose();
		} catch (error) {
			console.error("Error adding course:", error.message);
			alert("Error adding course details ");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (data) => {
		if (editCourse) {
			try {
				setLoading(true);
				await updateCourse(editCourse.course_id, data);
				alert("Course details updated successfully");
				reset();
				onClose();
			} catch (error) {
				console.error("Error updating course:", error.message);
				alert("Error updating course details ");
			} finally {
				setLoading(false);
			}
		} else {
			await handleAdd(data);
		}
	};

	return (
		<section className="relative w-[80vw] md:w-[50vw] md:min-w-[600px] border-2 bg-gray-50 flex flex-col justify-between border-dark-green p-0 rounded-md">
			<div className="relative flex items-center justify-between w-full border-b border-gray-100 dark:border-gray-700 ">
				<div className="bg-dark-green/80 w-full text-center p-3">
					<h4 className="text-xl font-semibold text-white">
						{editCourse ? "Update Course Details" : "Add New Course"}
					</h4>
					<p className="pt-2 mb-0 text-sm text-gray-50">
						{editCourse
							? "Edit the necessary course information here"
							: "Add the necessary course information here"}
					</p>
				</div>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-7">
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							id="course_name"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.course_name
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("course_name", { required: true })}
							placeholder="Enter course name"
							value={course_name}
							onChange={(e) => setCourseName(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="flex-1 my-3.5">
						<select
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.department_id
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
						{editCourse ? "Update Course" : "Add Course"}
					</button>
				</div>
			</form>
		</section>
	);
};
export default AddCourseForm;
