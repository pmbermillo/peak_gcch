import React from 'react'
import { Outlet } from 'react-router-dom'
import {Sidebar} from '../Sidebar.jsx'
import { useState } from 'react'

const AuthenticatedLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

            {/* Main Content */}
            {/* <main className="flex-1 p-6 overflow-y-auto transition-all duration-300"> <Outlet /></main> */}
            <main
                className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
                    isSidebarOpen ? "ml-56" : "ml-16"
                }`}
            >
                <Outlet />
            </main>
        </div>
    )
}

export default AuthenticatedLayout