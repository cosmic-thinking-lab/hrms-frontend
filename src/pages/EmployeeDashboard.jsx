import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { attendance, salarySlips, holidays } from '../utils/dummyData';
import { getEmployeeMenuItems } from '../utils/menuConfig.jsx';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Calculate attendance statistics
    const userAttendance = attendance.filter(a => a.employeeId === user.employeeId);
    const presentDays = userAttendance.filter(a => a.status === 'PRESENT').length;
    const leaveDays = userAttendance.filter(a => a.status === 'LEAVE').length;
    const totalDays = userAttendance.length;

    // Get latest salary slip
    const userSalarySlips = salarySlips.filter(s => s.employeeId === user.employeeId);
    const latestSalary = userSalarySlips[0];

    // Get upcoming holidays
    const today = new Date();
    const upcomingHolidays = holidays
        .filter(h => new Date(h.date) > today)
        .slice(0, 3);

    const menuItems = getEmployeeMenuItems();

    const quickActions = [
        {
            title: 'View Profile',
            description: 'Update your personal information',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            color: 'blue',
            path: '/employee/profile'
        },
        {
            title: 'Onboarding Docs',
            description: 'Upload required documents',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            color: 'green',
            path: '/employee/onboarding'
        },
        {
            title: 'Salary Slips',
            description: 'Download your salary slips',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V9C20 8.46957 19.7893 7.96086 19.4142 7.58579C19.0391 7.21071 18.5304 7 18 7H15M9 7V5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5V7M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            color: 'purple',
            path: '/employee/salary-slip'
        },
        {
            title: 'Holiday Calendar',
            description: 'View upcoming holidays',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            color: 'orange',
            path: '/employee/holidays'
        }
    ];

    return (
        <Layout menuItems={menuItems} title="Dashboard">
            <div className="dashboard">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h2>Welcome back, {user.personalInfo.firstName}! 👋</h2>
                        <p>Here's what's happening with your account today</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card stat-blue">
                        <div className="stat-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">Present Days</span>
                            <span className="stat-value">{presentDays}</span>
                        </div>
                    </div>

                    <div className="stat-card stat-green">
                        <div className="stat-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">Attendance Rate</span>
                            <span className="stat-value">{totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0}%</span>
                        </div>
                    </div>

                    <div className="stat-card stat-purple">
                        <div className="stat-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">Leave Taken</span>
                            <span className="stat-value">{leaveDays}</span>
                        </div>
                    </div>

                    <div className="stat-card stat-orange">
                        <div className="stat-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">Working Days</span>
                            <span className="stat-value">{totalDays}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="section">
                    <h3 className="section-title">Quick Actions</h3>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, index) => (
                            <div
                                key={index}
                                className={`action-card action-${action.color}`}
                                onClick={() => navigate(action.path)}
                            >
                                <div className="action-icon">{action.icon}</div>
                                <div className="action-content">
                                    <h4>{action.title}</h4>
                                    <p>{action.description}</p>
                                </div>
                                <svg className="action-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity & Upcoming Holidays */}
                <div className="two-column-grid">
                    {/* Latest Salary */}
                    {latestSalary && (
                        <div className="info-card">
                            <h3 className="card-title">Latest Salary Slip</h3>
                            <div className="salary-info">
                                <div className="salary-month">
                                    {new Date(latestSalary.year, latestSalary.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                                <div className="salary-amount">₹{latestSalary.details.netSalary.toLocaleString()}</div>
                                <button className="view-button" onClick={() => navigate('/employee/salary-slip')}>
                                    View All Slips
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Upcoming Holidays */}
                    <div className="info-card">
                        <h3 className="card-title">Upcoming Holidays</h3>
                        <div className="holidays-list">
                            {upcomingHolidays.map((holiday, index) => (
                                <div key={index} className="holiday-item">
                                    <div className="holiday-date">
                                        {new Date(holiday.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </div>
                                    <div className="holiday-details">
                                        <span className="holiday-name">{holiday.name}</span>
                                        <span className="holiday-type">{holiday.type}</span>
                                    </div>
                                </div>
                            ))}
                            <button className="view-button" onClick={() => navigate('/employee/holidays')}>
                                View All Holidays
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeDashboard;
