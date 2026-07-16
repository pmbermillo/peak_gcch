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
import OrgChartPage from '../Pages/Public/OrgChartPage.jsx'
import Report from '../Pages/Public/Report.jsx'
import Rta from '../Pages/Public/Rta.jsx'
import Billing from '../Pages/Public/Billing.jsx'
import LinkForm from '../Component/LinkForm.jsx'
import PayrollHours from '../Pages/Public/PayrollHours.jsx'
import AttendanceBonus from '../Pages/Public/AttendanceBonus.jsx'
import Forms from '../Pages/Public/Forms.jsx'
import PolicyFile from '../Pages/Public/PolicyFile.jsx'
import Faq from '../Pages/Public/Faq.jsx'

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
                    path="orgchart" 
                    element={
                        <ProtectedRoute>
                            <OrgChartPage />
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
                <Route 
                    path="link-report" 
                    element={
                        <ProtectedRoute>
                            <Report />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="link-form" 
                    element={
                        <ProtectedRoute>
                            <LinkForm />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="link-rta" 
                    element={
                        <ProtectedRoute>
                            <Rta />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="link-billing" 
                    element={
                        <ProtectedRoute>
                            <Billing />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="link-payroll-hours" 
                    element={
                        <ProtectedRoute>
                            <PayrollHours />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="link-attendance-bonus" 
                    element={
                        <ProtectedRoute>
                            <AttendanceBonus />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="link-forms-file" 
                    element={
                        <ProtectedRoute>
                            <Forms />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="policy-file" 
                    element={
                        <ProtectedRoute>
                            <PolicyFile />
                        </ProtectedRoute>
                }/>
                <Route 
                    path="faq" 
                    element={
                        <ProtectedRoute>
                            <Faq />
                        </ProtectedRoute>
                }/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default Router