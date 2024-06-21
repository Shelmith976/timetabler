import React from "react";
import { MdGroup } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom"; // Corrected import statement
import { useState } from "react";


const Adminmain = () => {
	const navigate = useNavigate();
	const [timetableData, setTimetableData] = useState([]);
	const handleGenerateTimetable = async () => {
		try {
			const response = await fetch("http://localhost:3005/tr/trials"); // Fetch data from URL
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json(); // Parse response as JSON
			setTimetableData(data); 
			  console.log(data)
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	return (
		<div className="p-2 py-8">
			<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				<CountCard
					iconColor="text-orange-800"
					countColor="text-orange-500"
					icon={MdGroup}
					title="Departments"
					count={10}
				/>
				<CountCard
					iconColor="text-indigo-100"
					countColor="text-indigo-100"
					icon={MdGroup}
					title="Lecturers"
					count={32}
				/>
				<CountCard
					iconColor="text-indigo-100"
					countColor="text-indigo-100"
					icon={MdGroup}
					title="Batches"
					count={8}
				/>
				<CountCard
					iconColor="text-red-800"
					countColor="text-red-500"
					icon={MdGroup}
					title="Subjects"
					count={42}
				/>
			</div>

			<div className="my-5">
				<h2 className="text-xl font-bold uppercase opacity-75">Quick Links</h2>

				<div className="flex my-4 gap-4 flex-wrap">
					<div className="shadow inline-block px-5 py-2.5  bg-dark-green text-light-gray font-semibold rounded-sm">
						<Link to="/admin/lecturers?action=new">
							<a>Add Lecturer</a>
						</Link>
					</div>
					<div className="shadow inline-block px-5 py-2.5  bg-dark-green text-light-gray font-semibold rounded-sm">
						<Link to="/admin/courses?action=new">
							<a>Add Course</a>
						</Link>
					</div>
					<div className="shadow inline-block px-5 py-2.5  bg-dark-green text-light-gray font-semibold rounded-sm">
						<Link to="/admin/departments?action=new">
							<a>Add Department</a>
						</Link>
					</div>
					<div className="shadow inline-block px-5 py-2.5  bg-dark-green text-light-gray font-semibold rounded-sm">
						<Link to="/admin/batches?action=new">
							<a>Add Batch</a>
						</Link>
					</div>
					<div className="shadow inline-block px-5 py-2.5  bg-dark-green text-light-gray font-semibold rounded-sm">
						<Link to="/admin/settings">
							<a>Settings</a>
						</Link>
					</div>
					{/* <button
						className="inline-flex gap-2.5 items-center px-5 py-2.5 font-semibold my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none"
						onClick={downloadJSON}
						disabled={!data}
					>
						Generate Timetable as JSON
					</button> 
	*/}
					<button
						className="inline-flex gap-2.5 items-center px-5 py-2.5 font-semibold my-1 border-dark-green border text-dark-green rounded transition duration-300 hover:bg-dark-green hover:text-white focus:outline-none"
						onClick={handleGenerateTimetable}
					>
						Generate Timetable
					</button>
				</div>
			</div>
		</div> 
	);
};

export default Adminmain;


const CountCard = ({ iconColor, countColor, icon: Icon, title, count }) => (
	<div className="rounded-md bg-white shadow-md px-6 py-4 flex items-center space-x-4">
		<Icon
			className={`text-4xl my-2 ${iconColor ? iconColor : "text-indigo-800"}`}
		/>
		<div className="flex flex-col space-y-2">
			<h2 className="tracking-wider text-xl uppercase text-gray-600">
				{title}
			</h2>
			<span
				className={`${countColor ? countColor : "text-dark-orange"
					} tracking-wider font-bold text-2xl`}>
				{count}
			</span>
		</div>
	</div>
);