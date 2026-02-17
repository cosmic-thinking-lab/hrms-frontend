import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI } from '../../utils/api';
import { monthNames } from '../../utils/dummyData';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';
import './Attendance.css';

const Attendance = () => {
    const { user, token } = useAuth();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAttendance = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await attendanceAPI.getByUser(token, user.employeeId);

            if (response.success) {
                // Handle different response structures gracefully (records, attendance, or direct array)
                const data = response.data || response.records || response.attendance || (Array.isArray(response) ? response : []);
                setAttendanceRecords(Array.isArray(data) ? data : []);
            } else {
                setError(response.message || 'Failed to fetch attendance');
            }
        } catch (err) {
            setError('An error occurred while fetching attendance');
        } finally {
            setLoading(false);
        }
    }, [token, user.employeeId]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    const userAttendance = attendanceRecords.filter(a => {
        const date = new Date(a.date);
        return date.getMonth() === selectedMonth &&
            date.getFullYear() === selectedYear;
    });

    const stats = {
        present: userAttendance.filter(a => a.status === 'PRESENT').length,
        leave: userAttendance.filter(a => a.status === 'LEAVE').length,
        holiday: userAttendance.filter(a => a.status === 'HOLIDAY').length,
        total: userAttendance.length
    };

    const menuItems = getEmployeeMenuItems();

    return (
        <Layout menuItems={menuItems} title="Attendance">
            <div className="attendance-page">
                <div className="attendance-controls">
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="month-select">
                        {monthNames.map((month, index) => (
                            <option key={index} value={index}>{month}</option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="year-select">
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>

                {loading ? (
                    <div className="attendance-loading">
                        <div className="loader"></div>
                        <p>Fetching your attendance records...</p>
                    </div>
                ) : error ? (
                    <div className="attendance-error">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <p>{error}</p>
                        <button onClick={fetchAttendance}>Try Again</button>
                    </div>
                ) : (
                    <>
                        <div className="attendance-stats">
                            <div className="attendance-stat stat-present">
                                <div className="stat-icon-att"><svg viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" /></svg></div>
                                <div><span className="stat-label-att">Present</span><span className="stat-value-att">{stats.present}</span></div>
                            </div>
                            <div className="attendance-stat stat-leave">
                                <div className="stat-icon-att"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8L6 20M6 8L18 20" stroke="currentColor" strokeWidth="2" /></svg></div>
                                <div><span className="stat-label-att">Leave</span><span className="stat-value-att">{stats.leave}</span></div>
                            </div>
                            <div className="attendance-stat stat-holiday">
                                <div className="stat-icon-att"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" /></svg></div>
                                <div><span className="stat-label-att">Holiday</span><span className="stat-value-att">{stats.holiday}</span></div>
                            </div>
                            <div className="attendance-stat stat-total">
                                <div className="stat-icon-att"><svg viewBox="0 0 24 24" fill="none"><path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="2" /></svg></div>
                                <div><span className="stat-label-att">Total Days</span><span className="stat-value-att">{stats.total}</span></div>
                            </div>
                        </div>

                        <div className="attendance-table-container">
                            {userAttendance.length > 0 ? (
                                <table className="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Day</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userAttendance.map((record, index) => (
                                            <tr key={index}>
                                                <td>{new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                                <td><span className={`status-badge-att status-${record.status.toLowerCase()}`}>{record.status}</span></td>
                                                <td>{record.remarks || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="no-attendance">
                                    <p>No attendance records found for {monthNames[selectedMonth]} {selectedYear}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Attendance;
