import React from "react";
import { MdMarkEmailUnread } from "react-icons/md";

const Header = () => {
	return (
		<header className="navbar z-40 py-4 bg-white shadow-sm dark:bg-gray-800">
			<div className="flex-1 h-full px-6 mx-auto text-green-500 dark:text-green-500">
				<a className="btn btn-ghost text-xl">Timetable Generation System</a>
			</div>
			<div className="flex items-baseline gap-3.5 ">
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
						<div className="indicator">
							<MdMarkEmailUnread size={24} />
							<span className="badge badge-xs indicator-item">8</span>
						</div>
					</div>
					<div
						tabIndex={0}
						className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
						<div className="card-body">
							<span className="font-bold text-lg">8 Items</span>
							<span className="text-info">Subtotal: $999</span>
							<div className="card-actions">
								<button className="btn btn-primary btn-block">View cart</button>
							</div>
						</div>
					</div>
				</div>
				<div className="dropdown dropdown-end">
					<div
						tabIndex={0}
						role="button"
						className="btn btn-ghost btn-circle avatar">
						<div className="w-6 rounded-full">
							<img
								alt="Tailwind CSS Navbar component"
								src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
							/>
						</div>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
						<li>
							<a className="justify-between">
								Profile
								<span className="badge">New</span>
							</a>
						</li>
						<li>
							<a>Settings</a>
						</li>
						<li>
							<a>Logout</a>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
};

export default Header;
