import React from "react";
import { MdGroup } from "react-icons/md";
import { Link, useNavigate, Outlet } from "react-router-dom"; // Corrected import statement
import { trials } from "../api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {ErrorBoundary} from '../components/ErrorBoundary'


const Admin = () => {
	

	return (
		<div className="flex min-h-screen bg-gray-50">
			<Sidebar />

			<div className="flex flex-col ml-[240px] flex-1 xl:flex-row">
				<main className="flex-1">
					<Header />
					<ErrorBoundary>
						<Outlet />
					</ErrorBoundary>
				</main>
			</div>
		</div>
	);

};



export default Admin;
