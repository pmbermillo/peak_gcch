import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import {
	Bars3Icon,
	XMarkIcon,
	HomeIcon,
	ChartBarIcon,
	UserGroupIcon,
	ClipboardDocumentCheckIcon,
	ArrowTrendingDownIcon, 
	Cog6ToothIcon,
	ChevronDownIcon, ArrowRightOnRectangleIcon, DocumentTextIcon, ReceiptPercentIcon, ClipboardDocumentListIcon
	} from "@heroicons/react/24/outline"
import { useUser } from "../Pages/Auth/UserContext";
import { LogoutAPI } from "../Api/Auth/AuthApi";
import { toast } from 'react-toastify';

export const Sidebar = ({open, setOpen}) =>{
	const { user } = useUser();
	const navigate = useNavigate();
	const [openSettings, setOpenSettings] = useState(false) 
	const [openLinks, setOpenLinks] = useState(false)
	const [openPayroll, setOpenPayroll] = useState(false)

	const handleLogout = async () => {
		try {
			const response = await LogoutAPI();
			toast.success(response.data.message);
			localStorage.removeItem('auth_token');
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div
		className={`fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-900 via-blue-900 to-black backdrop-blur-lg border-r border-white/20 shadow-xl z-50 transition-all duration-300 ${
    	open ? "w-56" : "w-16"
		} flex flex-col`}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 text-white">
				<span className="font-bold tracking-wide">
					{open && "Global Command Center Hub"}
				</span>
				<button onClick={() => setOpen(!open)}>
					{open ? (
						<XMarkIcon className="h-6 w-6 text-gray-300 hover:text-white transition" />
					) : (
						<Bars3Icon className="h-6 w-6 text-gray-300 hover:text-white transition" />
					)}
				</button>
			</div>

			{/* Nav */}
			<nav className="flex-1 px-2 space-y-2 text-gray-300">
				<Link
					to="/dashboard"
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition"
				>
					<HomeIcon className="h-5 w-5" />
					{open && "Dashboard"}
				</Link>
				<Link
					to="/orgchart"
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition"
				>
					<UserGroupIcon className="h-5 w-5" />
					{open && "Organizational Chart"}
				</Link>
				{["ADMIN","RTA","SCHEDULER","RA"].includes(user?.permission) && (
					<Link
						to="/policy-file"
						className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition"
					>
						<ClipboardDocumentCheckIcon className="h-5 w-5" />
						{open && "Policy File"}
					</Link>
				)} 
				{["ADMIN","VP","FINANCE CONTROLLER","RA", "CHIEF OF STAFF"].includes(user?.permission) && (
					<div>
						<button
						onClick={() => setOpenPayroll(!openPayroll)}
						className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition w-full justify-between"
						>
							<span className="flex items-center gap-2">
								<ReceiptPercentIcon  className="h-5 w-5" />
								{open && "Payroll Links"}
							</span>
							{open && (
								<ChevronDownIcon
								className={`h-4 w-4 transition-transform ${
									openPayroll ? "rotate-180" : ""
								}`}
								/>
							)}
						</button>
						{openPayroll && open && (
						<div className="ml-8 space-y-1">
							<Link
							to="/link-payroll-hours"
							className="block p-1 text-sm hover:underline"
							>
								Payroll Hours
							</Link>
							<Link
							to="/link-attendance-bonus"
							className="block p-1 text-sm hover:underline"
							>
								Attendance Bonus
							</Link>
							<Link
							to="/link-forms-file"
							className="block p-1 text-sm hover:underline"
							>
								Forms
							</Link>
						</div>
						)}
					</div>
				)} 
				<div>
					<button
					onClick={() => setOpenLinks(!openLinks)}
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition w-full justify-between"
					>
						<span className="flex items-center gap-2">
							<DocumentTextIcon className="h-5 w-5" />
							{open && "WFM Services"}
						</span>
						{open && (
							<ChevronDownIcon
							className={`h-4 w-4 transition-transform ${
								openLinks ? "rotate-180" : ""
							}`}
							/>
						)}
					</button>
					{openLinks && open && (
					<div className="ml-8 space-y-1">
						<Link
						to="/link-report"
						className="block p-1 text-sm hover:underline"
						>
							Reporting
						</Link>
						<Link
						to="/link-rta"
						className="block p-1 text-sm hover:underline"
						>
							Real Time Monitoring
						</Link>
						<Link
						to="/link-billing"
						className="block p-1 text-sm hover:underline"
						>
							Billing
						</Link>
						<Link
						to="/link-staffing"
						className="block p-1 text-sm hover:underline"
						>
							Staffing
						</Link>
						<Link
						to="/link-scheduling"
						className="block p-1 text-sm hover:underline"
						>
							Scheduling
						</Link>
						<Link
						to="/other-links"
						className="block p-1 text-sm hover:underline"
						>
							Other Links
						</Link>
					</div>
					)}
				</div>
				<Link
					to="/faq"
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition"
				>
					<ClipboardDocumentListIcon className="h-5 w-5" />
					{open && "FAQs"}
				</Link>
				{["ADMIN"].includes(user?.permission) && (
					<div>
						<button
						onClick={() => setOpenSettings(!openSettings)}
						className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition w-full justify-between"
						>
							<span className="flex items-center gap-2">
								<Cog6ToothIcon className="h-5 w-5" />
								{open && "Settings"}
							</span>
							{open && (
								<ChevronDownIcon
								className={`h-4 w-4 transition-transform ${
									openSettings ? "rotate-180" : ""
								}`}
								/>
							)}
						</button>
						{openSettings && open && (
						<div className="ml-8 space-y-1">
							<Link
							to="/user-management"
							className="block p-1 text-sm hover:underline"
							>
								User
							</Link>
							<Link
							to="/notification-management"
							className="block p-1 text-sm hover:underline"
							>
								Notification
							</Link>
						</div>
						)}
					</div>
				)}
				<br/>
				<div onClick={handleLogout}
					className="flex items-center gap-3 p-2 rounded-md cursor-pointer
								hover:bg-red-600/20 hover:text-red-500 transition-colors"
					>
					<ArrowRightOnRectangleIcon className="h-5 w-5" />
					{open && <span className="font-medium">Logout</span>}
				</div>
			</nav>
			{/* Profile */}
			<div className="p-4 border-t border-white/20 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition">
				{open && (
					<div className="flex flex-col items-start">
						<Link
						to="/profile"
						className="text-sm font-medium text-gray-200 tracking-wide"
						>
						{user?.firstname} {user?.lastname}
						</Link>
						<span className="text-xs text-gray-400">{user?.permission}</span>
					</div>
				)}
			</div>
		</div>
	)
}
