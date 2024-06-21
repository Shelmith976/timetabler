import React, { useState } from "react";
import Papa from "papaparse";

const DataTable = ({ columns, data, editItem, deleteItem }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortColumn, setSortColumn] = useState(null);
	const [sortType, setSortType] = useState("asc");
	const [selectedItems, setSelectedItems] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// Search/Filter
	const filteredData = data.filter((item) => {
		return columns.some((column) =>
			String(item[column]).toLowerCase().includes(searchTerm.toLowerCase()),
		);
	});

	// Sort
	const sortedData = filteredData.sort((a, b) => {
		if (sortColumn) {
			const isReversed = sortType === "asc" ? 1 : -1;
			return isReversed * String(a[sortColumn]).localeCompare(b[sortColumn]);
		}
		return 0;
	});

	// Pagination
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

	// Function to convert camelCase or snake_case to Title Case
	const toTitleCase = (str) => {
		return str
			.replace(/_/g, " ")
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	// Handle row selections
	const toggleSelectAll = () => {
		if (selectedItems.length === data.length) {
			setSelectedItems([]); // If all items are selected, clear selection
		} else {
			setSelectedItems(data); // Else, select all items
		}
	};

	const toggleSelectedItem = (item) => {
		setSelectedItems((prevSelectedItems) =>
			prevSelectedItems.includes(item)
				? prevSelectedItems.filter((i) => i !== item)
				: [...prevSelectedItems, item],
		);
	};
	const handleDelete = (item) => {
		if (window.confirm("Are you sure you want to delete?")) {
			deleteItem(item);
		}
	};

	// Function to delete all selected items
	const deleteSelectedItems = () => {
		selectedItems.forEach((item) => handleDelete(item)); // Call handleDelete for each selected item
		setSelectedItems([]); // Clear selection
	};

	// Function to export data to CSV
	const exportToCsv = () => {
		const csv = Papa.unparse(data);
		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.setAttribute("hidden", "");
		a.setAttribute("href", url);
		a.setAttribute("download", "data.csv");
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	// Function to render data
	const renderData = currentItems.map((item, index) => {
		return (
			<tr
				key={index}
				className="text-gray-700 px-4 leading-7 border-b rounded border-dark-green hover:bg-light-gray">
				<td>
					<input
						className="relative float-left ml-[0.25rem]  mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
						type="checkbox"
						id="selectitem"
						value=""
						checked={selectedItems.includes(item)}
						onChange={() => toggleSelectedItem(item)}
					/>
				</td>
				{columns.map((column) => (
					<td key={column}>{item[column]}</td>
				))}
				<td className="flex items-center gap-2">
					<button
						onClick={() => editItem(item)}
						className="text-sm px-2.5 my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none">
						Edit
					</button>
					<button
						onClick={() => handleDelete(item)}
						className="text-sm px-2.5 my-1 border-dark-orange border text-dark-orange rounded transition duration-300 hover:bg-dark-orange hover:text-white focus:outline-none">
						Delete
					</button>
				</td>
			</tr>
		);
	});

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<div className="">
					<input
						type="search"
						className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
						id="search"
						placeholder="Type search"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<label
						htmlFor="search"
						className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
						Search
					</label>
				</div>
				{/* Conditional rendering of buttons based on selected items */}
				{selectedItems.length > 0 && (
					<div className="flex items-center gap-5">
						<button
							onClick={deleteSelectedItems}
							className="disabled:opacity-50 text-sm px-3 py-[0.32rem] border-dark-orange border text-dark-orange rounded-sm font-semibold transition duration-300 hover:bg-dark-orange hover:text-white focus:outline-none"
							disabled={selectedItems.length === 0}>
							Delete Items
						</button>

						<button
							onClick={exportToCsv}
							className="disabled:opacity-50 text-sm px-3 py-[0.32rem] border-dark-green border text-dark-green rounded-sm font-semibold transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none"
							disabled={selectedItems.length === 0}>
							Export to CSV
						</button>
					</div>
				)}
			</div>

			<table className="w-full py-4">
				<thead>
					<tr className="bg-dark-green text-white font-semibold ">
						<th>
							<input
								type="checkbox"
								checked={selectedItems.length === data.length}
								onChange={toggleSelectAll}
								className="relative mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
							/>
						</th>
						{columns.map((column) => (
							<th key={column} className="py-2.5">
								{toTitleCase(column)}
							</th>
						))}
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>{renderData}</tbody>
			</table>

			<nav className="relative z-0 inline-flex shadow-sm mt-6">
				<div>
					{Array(Math.ceil(sortedData.length / itemsPerPage))
						.fill()
						.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentPage(index + 1)}
								className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-blue-700 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-150 hover:bg-tertiary">
								{index + 1}
							</button>
						))}
				</div>
			</nav>
		</div>
	);
};

export default DataTable;