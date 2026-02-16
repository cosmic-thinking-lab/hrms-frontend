import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { employees, attendance, salarySlips } from '../utils/dummyData';
import { getAdminMenuItems } from '../utils/menuConfig.jsx';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const stats = {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'ACTIVE').length,
        presentToday: attendance.filter(a => a.status === 'PRESENT' && new Date(a.date).toDateString() === new Date().toDateString()).length,
        onLeave: attendance.filter(a => a.status === 'LEAVE' && new Date(a.date).toDateString() === new Date().toDateString()).length
    };

    const menuItems = getAdminMenuItems();

    const quickActions = [
        {
            title: 'Add Employee',
            description: 'Create new employee profile',
            icon: <svg viewBox="0 0 24 24" fill="none"><path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M20 8V14M23 11H17M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7Z" stroke="currentColor" strokeWidth="2" /></svg>,
            color: 'blue',
            path: '/admin/employees'
        },
        {
            title: 'Upload Salary Slips',
            description: 'Upload monthly payroll',
            icon: <svg viewBox="0 0 24 24" fill="none"><path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" /></svg>,
            color: 'green',
            path: '/admin/salary-upload'
        },
        {
            title: 'Manage Holidays',
            description: 'Update holiday calendar',
            icon: <svg viewBox="0 0 24 24" fill="none"><path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="2" /></svg>,
            color: 'purple',
            path: '/admin/holidays'
        },
        {
            title: 'View All Employees',
            description: 'Manage employee database',
            icon: <svg viewBox="0 0 24 24" fill="none"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" /></svg>,
            color: 'orange',
            path: '/admin/employees'
        }
    ];

    return (
        <Layout menuItems={menuItems} title="Admin Dashboard">
            <div className="admin-dashboard">
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h2>Admin Dashboard 👨‍💼</h2>
                        <p>Manage your workforce and organizational data</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card stat-blue">
                        <div className="stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" /></svg></div>
                        <div className="stat-details"><span className="stat-label">Total Employees</span><span className="stat-value">{stats.totalEmployees}</span></div>
                    </div>
                    <div className="stat-card stat-green">
                        <div className="stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" /></svg></div>
                        <div className="stat-details"><span className="stat-label">Active Employees</span><span className="stat-value">{stats.activeEmployees}</span></div>
                    </div>
                    <div className="stat-card stat-purple">
                        <div className="stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="2" /></svg></div>
                        <div className="stat-details"><span className="stat-label">Present Today</span><span className="stat-value">{stats.presentToday}</span></div>
                    </div>
                    <div className="stat-card stat-orange">
                        <div className="stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8L6 20M6 8L18 20" stroke="currentColor" strokeWidth="2" /></svg></div>
                        <div className="stat-details"><span className="stat-label">On Leave</span><span className="stat-value">{stats.onLeave}</span></div>
                    </div>
                </div>

                <div className="section">
                    <h3 className="section-title">Quick Actions</h3>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, index) => (
                            <div key={index} className={`action-card action-${action.color}`} onClick={() => navigate(action.path)}>
                                <div className="action-icon">{action.icon}</div>
                                <div className="action-content"><h4>{action.title}</h4><p>{action.description}</p></div>
                                <svg className="action-arrow" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" /></svg>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="two-column-grid">
                    <div className="info-card">
                        <h3 className="card-title">Recent Employees</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {employees.slice(0, 3).map((emp) => (
                                <div key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                                        {emp.personalInfo.firstName[0]}{emp.personalInfo.lastName[0]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{emp.personalInfo.firstName} {emp.personalInfo.lastName}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.personalInfo.designation}</div>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#667eea', fontWeight: '600' }}>{emp.employeeId}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="info-card">
                        <h3 className="card-title">System Overview</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#64748b' }}>Total Salary Slips</span>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{salarySlips.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#64748b' }}>Departments</span>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>3</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#64748b' }}>Attendance Records</span>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{attendance.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
