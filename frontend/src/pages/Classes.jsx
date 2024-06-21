import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsGear } from "react-icons/bs";

import { generateClass, getClasses } from "../api";
import downloadComponentInPDF from "../components/DownloadComponent";

const Classes = ({ classesdata }) => {
	const { register, handleSubmit } = useForm();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const [schedule, setSchedule] = useState(null);
	const [filterBy, setFilterBy] = useState("staffno");
	const [filterValue, setFilterValue] = useState("");

	const handleGenerateNew = async () => {
		setLoading(true);
		setError(null);
		try {
			await generateClass();
			const classData = await getClasses();
			const transformedData = classData.data.map((schedule) => ({
				staffno: schedule.lecturer_staffno,
				subjectCode: schedule.subject_code,
				roomNum: schedule.room_num,
				batchCode: schedule.batch_code,
				startTime: schedule.start_time,
				endTime: schedule.end_time,
				dayOfWeek: schedule.day_of_week,
			}));
			setSchedule(transformedData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const dataToRender = schedule || classesdata;

	const batchCodes = [...new Set(dataToRender.map((item) => item.batchCode))];

	const times = [];
	for (
		let i = 8;
		i <=
		Math.max(
			...dataToRender.map((item) => parseInt(item.endTime.split(":")[0])),
		);
		i++
	) {
		times.push(i);
	}

	const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	let filteredData;

	const onSubmit = (data) => {
		setFilterBy(data.filterBy);
		setFilterValue(data.filterValue);
	};

	// Filter data based on filterBy and filterValue
	filteredData = dataToRender.filter(
		(item) =>
			item[filterBy] &&
			item[filterBy].toLowerCase().includes(filterValue.toLowerCase()),
	);

	const downloadPDF = () => {
		const component = document.getElementById("class_schedule");
		downloadComponentInPDF(component);
	};

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-start gap-10 my-6 w-full">
				<button
					disabled={loading}
					type="submit"
					className=" inline-flex gap-2.5 items-center px-2.5 py-1 rounded text-white bg-dark-green/80 disabled:text-white capitalize !text-lg font-normal transition ease-in-out duration-500 hover:bg-dark-green"
					onClick={handleGenerateNew}>
					{loading ? (
						<BsGear size={20} className="!text-white animate-spin" />
					) : (
						<BsGear />
					)}
					Generate New
				</button>
				<button
					className="px-3.5 py-1 font-semibold border-dark-green text-dark-green border transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none"
					onClick={downloadPDF}>
					Download as PDF
				</button>
			</div>
			<div className="flex items-center justify-between my-6 w-full">
				<h2 className="font-bold text-primary-black w-1/3">
					Generated Classes
				</h2>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="text-primary-black/75 border border-dark-green rounded w-1/2 ">
					<label>
						<select
							{...register("filterBy")}
							className="px-2 py-1 text-primary-black capitalize w-1/3 bg-inherit focus:outline-none  focus-within:bg-white rounded">
							<option value="staffno">Lecturer</option>
							<option value="roomNum">Room</option>
							<option value="batchCode">Batch Code</option>
						</select>
					</label>
					<label>
						<input
							type="text"
							{...register("filterValue")}
							placeholder="Search for room, lecturer or batch"
							className="px-2 py-1 bg-white text-primary-black w-1/2 placeholder:normal-case placeholder:text-primary-black/50 placeholder:text-sm capitalize bg-inherit border-l focus:outline-none focus-within:bg-white "
						/>
					</label>
					<button
						type="submit"
						className="px-3.5 py-1 font-semibold border-dark-green border-l text-dark-green  transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
						<span>Search</span>
					</button>
				</form>
			</div>
			<table id="class_schedule" className="table-fixed">
				<thead>
					<tr className="table-row text-primary-black/75 ">
						<td className="table-cell font-semibold">Time/Day</td>
						<td className="table-cell font-semibold">Course</td>
						<td className="table-cell font-semibold">Batch</td>
						{times.map((time) => (
							<td key={time} className="table-cell">
								{`${time}:00`}
							</td>
						))}
					</tr>
				</thead>
				<tbody>
					{daysOfWeek.map((day) => {
						const dayRows = batchCodes.length;
						let remainingDuration = 0;
						return batchCodes.map((code, index) => (
							<tr key={code} className="table-row ">
								{index === 0 && (
									<td
										className="table-cell text-primary-black/75 font-semibold"
										rowSpan={dayRows}>
										{day}
									</td>
								)}
								<td className="table-cell text-primary-black/75">
									{code.split(" ")[0]}
								</td>
								<td className="table-cell text-primary-black/75">
									{code.split(" ")[1]}
								</td>
								{times.map((time) => {
									if (remainingDuration > 0) {
										remainingDuration--;
										return null;
									}
									const item = filteredData.find(
										(i) =>
											i.batchCode === code &&
											parseInt(i.startTime.split(":")[0]) === time &&
											i.dayOfWeek === day,
									);
									if (item) {
										const duration =
											parseInt(item.endTime.split(":")[0]) -
											parseInt(item.startTime.split(":")[0]);
										remainingDuration = duration - 1;
										return (
											<td
												key={time}
												className={`table-cell bg-dark-orange/50 text-primary-black/60 border-l-4 border-l-dark-green ${
													duration == 3 &&
													"bg-dark-yellow/50 border-l-dark-violet"
												} `}
												colSpan={duration}>
												{`${item.subjectCode}: ${item.staffno}, ${item.roomNum}`}
											</td>
										);
									} else {
										return <td key={time} className="table-cell"></td>;
									}
								})}
							</tr>
						));
					})}
				</tbody>
			</table>
		</section>
	);
};

export default Classes;
