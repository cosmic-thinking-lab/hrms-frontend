import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './styles/common.css';

import Attendance from './pages/employee/Attendance';
import HolidayList from './pages/employee/HolidayList';
import LeavePolicy from './pages/employee/LeavePolicy';
import Onboarding from './pages/employee/Onboarding';
import Profile from './pages/employee/Profile';
import SalarySlip from './pages/employee/SalarySlip';

import EmployeeManagement from './pages/admin/EmployeeManagement';
import ManageHolidays from './pages/admin/ManageHolidays';
import ManagePolicies from './pages/admin/ManagePolicies';
import SalaryUpload from './pages/admin/SalaryUpload';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />

                    {/* Employee Routes */}
                    <Route
                        path="/employee/dashboard"
                        element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>}
                    />
                    <Route
                        path="/employee/attendance"
                        element={<ProtectedRoute><Attendance /></ProtectedRoute>}
                    />
                    <Route
                        path="/employee/holidays"
                        element={<ProtectedRoute><HolidayList /></ProtectedRoute>}
                    />
                    <Route
                        path="/employee/policy"
                        element={<ProtectedRoute><LeavePolicy /></ProtectedRoute>}
                    />
                    <Route
                        path="/employee/onboarding"
                        element={<ProtectedRoute><Onboarding /></ProtectedRoute>}
                    />
                    <Route
                        path="/employee/profile"
                        element={<ProtectedRoute><Profile /></ProtectedRoute>}
                    />
                    <Route
                        path="/employee/salary-slip"
                        element={<ProtectedRoute><SalarySlip /></ProtectedRoute>}
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>}
                    />
                    <Route
                        path="/admin/employees"
                        element={<ProtectedRoute adminOnly={true}><EmployeeManagement /></ProtectedRoute>}
                    />
                    <Route
                        path="/admin/holidays"
                        element={<ProtectedRoute adminOnly={true}><ManageHolidays /></ProtectedRoute>}
                    />
                    <Route
                        path="/admin/policies"
                        element={<ProtectedRoute adminOnly={true}><ManagePolicies /></ProtectedRoute>}
                    />
                    <Route
                        path="/admin/salary-upload"
                        element={<ProtectedRoute adminOnly={true}><SalaryUpload /></ProtectedRoute>}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
