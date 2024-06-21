import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
	return (
		<div className=" w-[240px] fixed z-[99] top-0 bottom-0 left-0 overflow-y-auto flex flex-col py-8 bg-white h-screen">
			<div className="flex justify-center">
				<h3 className="font-bold text-3xl uppercase text-dark-orange">
					Timetabler
				</h3>
			</div>
			<ul className="menu my-8 ">
				<li className="text-dark-green hover:text-dark-green/80 flex">
					<Link to="departments" className="mb-2.5 font-semibold tracking-wide">
						Departments
					</Link>
				</li>
				<li className="text-dark-green hover:text-dark-green/80 flex">
					<Link to="lecturers" className="mb-2.5 font-semibold tracking-wide">
						Lecturers
					</Link>
				</li>

				<li className="text-dark-green hover:text-dark-green/80 flex">
					<Link to="courses" className="mb-2.5 font-semibold tracking-wide">
						Courses
					</Link>
				</li>
				<li className="text-dark-green hover:text-dark-green/80 flex">
					<Link to="batches" className="mb-2.5 font-semibold tracking-wide">
						Batches
					</Link>
				</li>
				<li className="text-dark-green hover:text-dark-green/80 flex">
					<Link to="subjects" className="mb-2.5 font-semibold tracking-wide">
						Subjects
					</Link>
				</li>
				<li className="text-dark-green hover:text-dark-green/80 flex">
					<Link to="rooms" className="mb-2.5 font-semibold tracking-wide">
						Rooms
					</Link>
				</li>

				{/* <li className="text-dark-green hover:text-dark-green/80 flex">
					<Link to="settings" className="mb-2.5 font-semibold tracking-wide">
						Settings
					</Link>
				</li> */}
				<li className="text-dark-green hover:text-dark-green/80 flex">
					<Link to="classes" className="mb-2.5 font-semibold tracking-wide">
						Timetable
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
