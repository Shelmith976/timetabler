import React, { useState } from "react";
import { useForm } from "react-hook-form";
import downloadComponentInPDF from "../components/DownloadComponent";

const Reports = ({ reportdata }) => {
	const [data, setData] = useState(reportdata);

	const { register, handleSubmit, watch } = useForm();
	const watchAllFields = watch();

	const times = [];
	for (
		let i = 8;
		i <= Math.max(...data.map((item) => parseInt(item.endTime.split(":")[0])));
		i++
	) {
		times.push(i);
	}

	const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

	const onSubmit = (classes) => {
		const filterBy = watchAllFields.filterBy;
		const filterValue = watchAllFields.filterValue;
		if (filterValue) {
			const filteredData = reportdata.filter(
				(item) => item[filterBy] === filterValue,
			);
			setData(filteredData);
		} else {
			setData(reportdata);
		}
	};

	const getFreeTimeSlots = (day, filterBy, filterValue) => {
		const occupiedTimes = data
			.filter(
				(item) =>
					item.dayOfWeek === day &&
					(!filterValue || item[filterBy] === filterValue),
			)
			.flatMap((item) => {
				const start = parseInt(item.startTime.split(":")[0]);
				const end = parseInt(item.endTime.split(":")[0]);
				return Array.from({ length: end - start + 1 }, (_, i) => start + i);
			});
		const freeTimes = times.filter((time) => !occupiedTimes.includes(time));

		// Combine consecutive times into ranges
		const timeRanges = [];
		for (let i = 0; i < freeTimes.length; i++) {
			const start = freeTimes[i];
			while (freeTimes[i + 1] - freeTimes[i] === 1) {
				i++;
			}
			const end = freeTimes[i];
			timeRanges.push(
				start === end ? `${start}:00` : `${start}:00 - ${end}:00`,
			);
		}

		return timeRanges.join(", ");
	};

	const filterValues = [
		...new Set(reportdata.map((item) => item[watchAllFields.filterBy])),
	];
	const filterNames = {
		staffno: "Lecturer",
		roomNum: "Room",
		batchCode: "Batch Code",
	};

	const downloadPDF = () => {
		const component = document.getElementById("available_times");
		downloadComponentInPDF(component);
	};

	return (
		<section className="grid px-6 mb-8 mx-auto">
			<div className="flex items-center justify-start gap-10 my-6 w-full">
				<button
					className="px-3.5 py-1 font-semibold border-dark-green text-dark-green border transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none"
					onClick={downloadPDF}>
					Download as PDF
				</button>
			</div>
			<div className="flex items-center justify-between my-6 w-full">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="text-primary-black/75 border border-dark-green rounded w-full ">
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
						className="px-1.5 py-1 font-semibold border-dark-green border-l text-dark-green transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
						<span>Search</span>
					</button>
				</form>
			</div>
			<table id="available_times" className="table-fixed">
				<thead>
					<tr className="table-row text-primary-black/75 ">
						<td className="table-cell font-semibold">Day of Week</td>
						<td className="table-cell font-semibold">
							{filterNames[watchAllFields.filterBy]}
						</td>
						<td className="table-cell font-semibold">Available Time</td>
					</tr>
				</thead>
				<tbody>
					{daysOfWeek.map((day) =>
						filterValues.map((filterValue, index) => (
							<tr key={filterValue} className="table-row  ">
								{index === 0 && (
									<td
										rowSpan={filterValues.length}
										className="table-cell text-primary-black/75">
										{day}
									</td>
								)}
								<td className="table-cell text-primary-black/75">
									{filterValue}
								</td>
								<td className="table-cell text-primary-black/75">
									{getFreeTimeSlots(day, watchAllFields.filterBy, filterValue)}
								</td>
							</tr>
						)),
					)}
				</tbody>
			</table>
		</section>
	);
};

export default Reports;
