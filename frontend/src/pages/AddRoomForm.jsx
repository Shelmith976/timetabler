import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { addRoom, updateRoom } from "../api";

const AddRoomForm = ({ onClose, editRoom }) => {
	const [loading, setLoading] = useState(false);

	const [room_num, setRoomNum] = useState("");
	const [room_name, setRoomName] = useState("");
	const [room_type, setRoomType] = useState("");
	const [room_capacity, setRoomCapacity] = useState();

	useEffect(() => {
		if (editRoom) {
			setRoomNum(editRoom.room_num);
			setRoomName(editRoom.room_name);
			setRoomType(editRoom.room_type);
			setRoomCapacity(editRoom.room_capacity);
		}
	}, [editRoom]);

	const {
		handleSubmit,
		formState: { errors },
		register,
		reset,
		control,
	} = useForm({
		defaultValues: {
			room_num: "",
			room_name: "",
			room_type: "",
			room_capacity: "",
		},
	});

	const onSubmit = async (data) => {
		editRoom ? handleUpdate(data) : handleAdd(data);
	};

	const handleAdd = async (data) => {
		try {
			setLoading(true);
			await addRoom(data);
			alert("Room details added successfully");
			reset();
			onClose();
		} catch (error) {
			console.error("Error adding room:", error.message);
			alert("Error adding room details ");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (data) => {
		if (editRoom) {
			setLoading(true);

			await updateRoom(editRoom.room_id, data);
			alert("Room details edited successfully");
			reset();
			onClose();
		} else {
			await addRoom(data);
		}
		onClose();
	};

	return (
		<section className="relative w-[80vw] md:w-[50vw] md:min-w-[600px] border-2 bg-gray-50 flex flex-col justify-between border-dark-green p-0 rounded-md">
			<div className="relative flex items-center justify-between w-full border-b border-gray-100 dark:border-gray-700 ">
				<div className="bg-dark-green/80 w-full text-center p-3">
					<h4 className="text-xl font-semibold text-white">
						{editRoom ? "Update Room Details" : "Add New Room"}
					</h4>
					<p className="pt-2 mb-0 text-sm text-gray-50">
						{editRoom
							? "Edit the necessary room information here"
							: "Add the necessary room information here"}
					</p>
				</div>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-7">
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="w-1/3 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black uppercase bg-gray-50 border placeholder:capitalize ${
								errors.room_num
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("room_num", { required: true })}
							placeholder="Enter room number"
							value={room_num}
							onChange={(e) => setRoomNum(e.target.value)}
						/>
					</div>
					<div className="w-2/3 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.room_type
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("room_type", { required: true })}
							placeholder="Enter room type"
							value={room_type}
							onChange={(e) => setRoomType(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex flex-col px-6 md:flex-row md:space-x-12">
					<div className="w-1/3 my-3.5">
						<input
							type="number"
							className={`w-full p-2 text-primary-black bg-gray-50 border ${
								errors.room_capacity
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("room_capacity", { required: true })}
							placeholder="Enter room capacity"
							value={room_capacity}
							onChange={(e) => setRoomCapacity(e.target.value)}
						/>
					</div>
					<div className="w-2/3 my-3.5">
						<input
							type="text"
							className={`w-full p-2 text-primary-black capitalize bg-gray-50 border ${
								errors.room_name
									? "border-b-2 border-t-0 border-dark-orange/50 focus:border-dark-orange "
									: "border-b-2 border-t-0 border-dark-green/50 focus:border-dark-green"
							} focus:outline-none  focus-within:bg-white rounded`}
							{...register("room_name", { required: true })}
							placeholder="Enter room name"
							value={room_name}
							onChange={(e) => setRoomName(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex items-center justify-end mt-4">
					<button
						type="submit"
						className="px-4 py-2 bg-dark-green text-white rounded-md hover:bg-dark-green-hover focus:outline-none focus:bg-dark-green-hover">
						{editRoom ? "Update Room" : "Add Room"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AddRoomForm;
