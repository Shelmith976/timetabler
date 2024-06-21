import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";

import DataTable from "../components/DataTable";
import { deleteRoom, getRooms } from "../api";
import Modal from "../components/Modal";
import AddRoomForm from "./AddRoomForm";

const columns = ["SNO", "room_num", "room_name", "room_type", "room_capacity"];

const Rooms = () => {
	const [showAddModal, setShowAddModal] = useState(false);
	const [rooms, setRooms] = useState([]);
	const [editRoom, setEditRoom] = useState(null);

	const { search } = useLocation();

	const fetchRooms = async () => {
		try {
			const roomsData = await getRooms();
			const transformedData = roomsData.data.map((rom, index) => ({
				SNO: index + 1,
				room_id: rom.room_id,
				room_num: rom.room_num,
				room_name: rom.room_name,
				room_type: rom.room_type,
				room_capacity: rom.room_capacity,
			}));
			setRooms(transformedData);
		} catch (error) {
			console.error("Error fetching rooms:", error);
		}
	};

	useEffect(() => {
		fetchRooms();
	}, [search, showAddModal]);

	const editItem = (item) => {
		const selectedRoom = rooms.find((rom) => rom.room_id === item.room_id);
		setShowAddModal(true);
		setEditRoom(selectedRoom);
	};

	const deleteItem = async (item) => {
		try {
			await deleteRoom(item.room_id);
			await fetchRooms();
		} catch (error) {
			console.error("Error deleting department:", error);
		}
	};

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-between mt-6">
				<h1 className="text-lg font-bold text-gray-800">Room's List</h1>
				<button
					onClick={() => setShowAddModal(true)}
					className="inline-flex gap-2.5 items-center px-5 py-2.5 font-semibold my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
					<MdPersonAdd size={24} />
					<span>Add Room</span>
				</button>
			</div>
			{showAddModal ? (
				<div className="fixed top-0 left-0 w-full h-full bg-primary-black opacity-10 backdrop-blur z-[999] hidden"></div>
			) : (
				<div className="min-w-0  my-6 overflow-hidden bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5">
					<div className="p-4">
						<DataTable
							columns={columns}
							data={rooms}
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
					setEditRoom(null);
				}}
				content={
					<AddRoomForm
						onClose={() => setShowAddModal(false)}
						editRoom={editRoom}
					/>
				}
			/>
		</section>
	);
};

export default Rooms;
