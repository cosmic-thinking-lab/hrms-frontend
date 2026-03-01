import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI, employeeAPI } from '../../utils/api';
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
    const [creationDate, setCreationDate] = useState(null);

    const fetchCreationDate = useCallback(async () => {
        try {
            const profileRes = await employeeAPI.getProfile(token, user.employeeId);
            // The getProfile util spreads data onto the response: { success, ...data }
            // So all profile fields are at root level of profileRes
            const rawDate =
                profileRes.createdAt ||
                profileRes.data?.createdAt ||
                profileRes.employee?.createdAt ||
                profileRes.user?.createdAt ||
                user.createdAt ||
                user.joiningDate ||
                user.personalInfo?.joiningDate;

            if (rawDate && !isNaN(new Date(rawDate).getTime())) {
                setCreationDate(rawDate);
                // Auto-select the creation month/year
                const d = new Date(rawDate);
                setSelectedMonth(d.getMonth());
                setSelectedYear(d.getFullYear());
            }
        } catch (err) {
            console.error('Failed to fetch creation date from profile:', err);
        }
    }, [token, user]);

    const fetchAttendance = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await attendanceAPI.getByUser(token, user.employeeId);
            if (response.success) {
                const data = response.records || response.data || response.attendance || (Array.isArray(response) ? response : []);
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
        fetchCreationDate();
        fetchAttendance();
    }, [fetchCreationDate, fetchAttendance]);

    const normalizeDate = (d) => {
        if (!d) return '';
        if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
        const date = new Date(d);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Calculate start date from actual creation date fetched from API
    const rawJoiningDate = creationDate || user.createdAt || user.personalInfo?.joiningDate || user.joiningDate || new Date().toISOString();
    const startDate = new Date(rawJoiningDate);
    startDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate all dates from creation to today
    const allDates = [];
    const currentIter = new Date(startDate);
    while (currentIter <= today) {
        allDates.push(new Date(currentIter));
        currentIter.setDate(currentIter.getDate() + 1);
    }
    allDates.reverse();

    // Merge actual records with all dates — default ABSENT
    // Only show PRESENT/LEAVE/etc. if admin has explicitly marked it
    const fullAttendance = allDates.map(date => {
        const dateStr = normalizeDate(date);
        const record = attendanceRecords.find(a => normalizeDate(a.date) === dateStr);
        if (record) {
            return { ...record, date: dateStr, status: record.status?.toUpperCase() || 'ABSENT' };
        }
        return { date: dateStr, status: 'ABSENT', remarks: '' };
    });

    // Filter by selected month/year for stats and table
    const userAttendance = fullAttendance.filter(a => {
        const date = new Date(a.date);
        return date.getMonth() === selectedMonth &&
            date.getFullYear() === selectedYear;
    });

    const stats = {
        present: userAttendance.filter(a => a.status === 'PRESENT').length,
        leave: userAttendance.filter(a => a.status === 'LEAVE').length,
        absent: userAttendance.filter(a => a.status === 'ABSENT').length,
        total: userAttendance.length
    };

    // Generate only months from creation date for the filter
    const creationDateObj = new Date(rawJoiningDate);
    const availableMonths = [];
    const iter = new Date(creationDateObj.getFullYear(), creationDateObj.getMonth(), 1);
    while (iter <= today) {
        availableMonths.push({ month: iter.getMonth(), year: iter.getFullYear() });
        iter.setMonth(iter.getMonth() + 1);
    }

    const menuItems = getEmployeeMenuItems();

    return (
        <Layout menuItems={menuItems} title="Attendance">
            <div className="attendance-page">
                <div className="attendance-controls">
                    <select
                        value={`${selectedYear}-${selectedMonth}`}
                        onChange={(e) => {
                            const [y, m] = e.target.value.split('-');
                            setSelectedYear(Number(y));
                            setSelectedMonth(Number(m));
                        }}
                        className="month-select"
                    >
                        {availableMonths.map(({ month, year }, index) => (
                            <option key={index} value={`${year}-${month}`}>
                                {monthNames[month]} {year}
                            </option>
                        ))}
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
                        <div className="stats-grid">
                            <div className="stat-card stat-blue">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01" /></svg>
                                </div>
                                <div className="stat-details">
                                    <span className="stat-label">Present</span>
                                    <span className="stat-value">{stats.present}</span>
                                </div>
                            </div>
                            <div className="stat-card stat-orange">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                </div>
                                <div className="stat-details">
                                    <span className="stat-label">Leave</span>
                                    <span className="stat-value">{stats.leave}</span>
                                </div>
                            </div>
                            <div className="stat-card stat-red">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                </div>
                                <div className="stat-details">
                                    <span className="stat-label">Absent</span>
                                    <span className="stat-value">{stats.absent}</span>
                                </div>
                            </div>
                            <div className="stat-card stat-teal">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" /></svg>
                                </div>
                                <div className="stat-details">
                                    <span className="stat-label">Total Days</span>
                                    <span className="stat-value">{stats.total}</span>
                                </div>
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
                                                <td className="att-date">{new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                <td className="att-day">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                                <td><span className={`status-badge-att status-${record.status.toLowerCase()}`}>{record.status}</span></td>
                                                <td className="att-remarks">{record.remarks || '—'}</td>
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
