import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { MdBackspace, MdPersonAdd } from "react-icons/md";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { firestore } from "../../lib/firebase";
// import toast from "react-hot-toast";

const AddSettingsForm = ({ cancel = () => {} }) => {
	const [loading, setLoading] = useState(false);
	const [prayer, setPrayer] = useState("");

	const {
		handleSubmit,
		formState: { errors },
		register,
		reset,
	} = useForm();

	const handleCloseDrawer = () => {
		reset();
		setPrayer("");
		cancel();
	};

	const handleAddPrayerSubmit = async (data) => {
		// if (!prayer) {
		// 	alert("Prayer is required");
		// 	return;
		// }
		// try {
		// 	const obj = {
		// 		...data,
		// 		prayer: prayer.toString().replaceAll("<p><br></p>", ""),
		// 		createdAt: serverTimestamp(),
		// 		updatedAt: serverTimestamp(),
		// 	};
		// 	setLoading(true);
		// 	const prayerCollection = collection(firestore, "prayers");
		// 	await addDoc(prayerCollection, obj);
		// 	setLoading(false);
		// 	toast.success("Prayer Added successfully");
		// 	handleCloseDrawer();
		// } catch (error) {
		// 	setLoading(false);
		// 	toast.error(error.message);
		// }
	};

	return (
		<section className="relative w-[600px] md:w-[600px] md:min-w-[600px] border-r flex flex-col justify-between border-gray-200 p-0 rounded-md">
			<div className="relative flex items-center justify-between w-full border-b border-gray-100 p-7 bg-gray-50 dark:border-gray-700 ">
				<div className="">
					<h4 className="text-xl font-semibold text-gray-800">
						Add New Prayer
					</h4>
					<p className="pt-2 mb-0 text-sm text-gray-500">
						Add the necessary prayer information here
					</p>
				</div>
			</div>
			<form onSubmit={handleSubmit(handleAddPrayerSubmit)} className="mt-6">
				<div className="flex flex-col px-6">
					<div className="flex-1 my-3.5">
						<input
							type="text"
							id="title"
							label="Prayer Title"
							// variant="outlined"
							className="w-full focus:!border-dark-green  bg-gray-50 focus-within:bg-white "
							error={!!errors.title}
							{...register("title", { required: true })}
							placeholder="Enter prayer title"
						/>
					</div>
				</div>
				<div className="flex flex-col px-5">
					<p className="mb-2 mt-5">Prayer</p>
					<textarea
						name=""
						id=""
						cols="30"
						rows="10"
						// handleChange={(value) => {
						// 	setPrayer(value);
						// }}
					></textarea>
				</div>
				<div className="relative flex flex-col items-center justify-between w-full p-6 mt-6 gap-3 sm:space-x-2 sm:flex-row ">
					<div className="relative flex flex-col items-center justify-between w-full p-6 mt-6 space-y-3 border-t border-gray-100 sm:flex-row sm:space-x-14 bg-gray-50 dark:border-gray-700 ">
						<button
							className="px-6 py-2.5 bg-dark-orange/80 hover:bg-dark-orange text-lg capitalize text-light-gray transition ease-in-out duration-500 rounded inline-flex gap-2.5 items-center"
							onClick={handleCloseDrawer}>
							<MdBackspace size={24} />
							<span>Cancel</span>
						</button>

						<button className="px-6 py-2.5 bg-dark-green/80 hover:bg-dark-green text-lg capitalize text-light-gray transition ease-in-out duration-500 rounded inline-flex gap-2.5 items-center">
							<MdPersonAdd size={24} />
							<span>Add Prayer</span>
						</button>
					</div>
				</div>
			</form>
		</section>
	);
};

export default AddSettingsForm;
