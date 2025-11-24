import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../Pages/Auth/Login.jsx'
import AuthenticatedLayout from '../Component/Layout/AuthenticatedLayout.jsx'
import Dashboard from '../Pages/Public/Dashboard.jsx'
import AttendanceDashboard from '../Pages/Public/AttendanceDashboard.jsx'
import AttritionDashboard from '../Pages/Public/AttritionDashboard.jsx'
import UserManagement from '../Pages/Public/UserManagement.jsx'
import Profile from '../Pages/Public/Profile.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path='/' element={<AuthenticatedLayout/>}>
                <Route 
                    path="dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="attendance-dashboard" 
                    element={
                        <ProtectedRoute>
                            <AttendanceDashboard />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="attrition-dashboard" 
                    element={
                        <ProtectedRoute>
                            <AttritionDashboard />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="user-management" 
                    element={
                        <ProtectedRoute>
                            <UserManagement />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="profile" 
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                }/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default Router