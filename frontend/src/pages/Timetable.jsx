import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Classes from "./Classes";
import Reports from "./Reports";

const Timetable = ({ initialData }) => {
	const [showClasses, setShowClasses] = useState(true);
	const [showReports, setShowReports] = useState(false);

	const times = [];
	for (
		let i = 8;
		i <=
		Math.max(
			...initialData.map((item) => parseInt(item.endTime.split(":")[0])),
		);
		i++
	) {
		times.push(i);
	}

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-between my-6 w-full">
				<button
					type="button"
					onClick={() => {
						setShowClasses(true);
						setShowReports(false);
					}}
					className="px-3.5 py-1.5 border font-semibold border-dark-green text-dark-green  transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
					<span>Generate Timetable</span>
				</button>
				<button
					type="button"
					onClick={() => {
						setShowReports(true);
						setShowClasses(false);
					}}
					className="px-3.5 py-1.5 border font-semibold border-dark-green text-dark-green  transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
					<span>Reports</span>
				</button>
			</div>
			<hr className="border" />

			{showClasses ? (
				<Classes classesdata={initialData} />
			) : (
				<Reports reportdata={initialData} />
			)}
		</section>
	);
};

export default Timetable;
