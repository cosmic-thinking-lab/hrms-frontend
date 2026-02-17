import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getAdminMenuItems } from '../../utils/menuConfig.jsx';
import { useAuth } from '../../context/AuthContext';
import { employeeAPI, payrollAPI, attendanceAPI } from '../../utils/api';
import { monthNames } from '../../utils/dummyData';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [employeeSlips, setEmployeeSlips] = useState([]);
    const [activeTab, setActiveTab] = useState('salary');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingRow, setUpdatingRow] = useState(null); // ID of the date being saved
    const [inlineData, setInlineData] = useState({}); // { [date]: { status, remarks } }
    const [attendanceRecords, setAttendanceRecords] = useState([]); // Real attendance data

    useEffect(() => {
        const fetchEmployeeData = async () => {
            console.log('--- INITIAL DATA FETCH START ---');
            try {
                // Fetch profile using the employeeId (id from useParams)
                const data = await employeeAPI.getProfile(token, id);
                console.log('Initial Profile Data:', data);
                let empData = data.user || data.employee || data.data || data;

                if (data && data.success !== false) {
                    setEmployee(empData);
                    // Fetch salary slips using the employee ID
                    const slipsData = await payrollAPI.getByEmployeeId(token, id);
                    console.log('Initial Salary Slips:', slipsData);
                    if (slipsData && Array.isArray(slipsData)) {
                        setEmployeeSlips(slipsData);
                    } else if (slipsData && slipsData.data && Array.isArray(slipsData.data)) {
                        setEmployeeSlips(slipsData.data);
                    } else if (slipsData && slipsData.salarySlips && Array.isArray(slipsData.salarySlips)) {
                        setEmployeeSlips(slipsData.salarySlips);
                    }

                    // Fetch real attendance records
                    const attData = await attendanceAPI.getByEmployeeId(token, id);
                    console.log('Initial Attendance Records:', attData);
                    if (attData && attData.success !== false) {
                        const records = attData.records || attData.data || attData.attendance || (Array.isArray(attData) ? attData : []);
                        console.log('Initial Records count:', records.length);
                        setAttendanceRecords(records);
                    }
                } else {
                    console.error('Failed to load employee profile (ERROR):', data.message || data);
                    setError('Failed to load real employee data');
                }
            } catch (err) {
                console.error('Error fetching employee (EXCEPTION):', err);
                setError('Failed to fetch employee details');
            } finally {
                console.log('--- INITIAL DATA FETCH END ---');
                setLoading(false);
            }
        };

        if (token && id) {
            fetchEmployeeData();
        }
    }, [token, id]);

    const handleMarkAttendance = async (date, status, remarks) => {
        console.log('--- ATTENDANCE MARK START ---');
        console.log('Target Date:', date);
        console.log('New Status:', status);
        console.log('Remarks:', remarks);

        setUpdatingRow(date);
        try {
            const payload = {
                employeeId: id,
                date: date,
                status: status,
                remark: remarks,
                remarks: remarks
            };
            console.log('API Payload:', payload);

            const response = await attendanceAPI.mark(token, payload);
            console.log('API Response:', response);

            if (response.success || response.data || response === true || (typeof response === 'object' && !response.message)) {
                console.log('Marking Success. Refreshing data...');
                // Refresh data quietly
                const data = await employeeAPI.getProfile(token, id);
                let empData = data.user || data.employee || data.data || data;
                setEmployee(empData);

                // Refresh attendance records too
                const attData = await attendanceAPI.getByEmployeeId(token, id);
                console.log('Refetched Attendance Data:', attData);
                if (attData && attData.success !== false) {
                    const records = attData.records || attData.data || attData.attendance || (Array.isArray(attData) ? attData : []);
                    console.log('Extracted Records count:', records.length);
                    setAttendanceRecords(records);
                }
            } else {
                console.error('Failed to mark attendance:', response.message || response);
            }
        } catch (err) {
            console.error('Error marking attendance (EXCEPTION):', err);
        } finally {
            console.log('--- ATTENDANCE MARK END ---');
            setUpdatingRow(null);
        }
    };

    const handleInlineChange = (date, field, value) => {
        setInlineData(prev => ({
            ...prev,
            [date]: {
                ...(prev[date] || {
                    status: fullAttendanceHistory.find(r => r.date === date)?.status || 'PRESENT',
                    remarks: fullAttendanceHistory.find(r => r.date === date)?.remarks || ''
                }),
                [field]: value
            }
        }));
    };

    const menuItems = getAdminMenuItems();

    if (loading) {
        return (
            <Layout menuItems={menuItems} title="Employee Details">
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
            </Layout>
        );
    }

    if (!employee) {
        return (
            <Layout menuItems={menuItems} title="Employee Details">
                <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>Employee not found</div>
            </Layout>
        );
    }

    // List of slips
    const slips = employeeSlips || [];

    // Robust data extraction for display
    const fullName = employee.personalInfo?.fullName ||
        (employee.personalInfo?.firstName ? `${employee.personalInfo.firstName} ${employee.personalInfo.lastName || ''}`.trim() : '') ||
        employee.fullName ||
        employee.name ||
        'Employee Name';

    const designation = employee.personalInfo?.designation || employee.designation || employee.role || 'Software Engineer';
    const department = employee.personalInfo?.department || employee.department || 'N/A';
    const initial = (employee.personalInfo?.firstName?.[0] || employee.fullName?.[0] || employee.name?.[0] || 'E').toUpperCase();

    // Robust date normalization (avoids timezone shifts)
    const normalizeDate = (d) => {
        if (!d) return '';
        if (typeof d === 'string') {
            // Already YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
            // ISO string or full date string - take the date part before 'T' or space
            if (d.includes('T')) return d.split('T')[0];
            if (d.includes(' ')) return d.split(' ')[0];
        }

        const date = new Date(d);
        if (isNaN(date.getTime())) return '';

        // Extract local components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Generate full attendance history from joining date to now
    const joiningDate = employee.personalInfo?.joiningDate || employee.joiningDate || new Date().toISOString();
    const startDate = new Date(joiningDate);
    const today = new Date();

    // Helper to generate all dates
    const allDates = [];
    const currentIter = new Date(startDate);
    currentIter.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    while (currentIter <= today) {
        allDates.push(new Date(currentIter));
        currentIter.setDate(currentIter.getDate() + 1);
    }

    // Reverse to show latest first
    allDates.reverse();

    // Actual attendance records from API
    const rawAttendance = attendanceRecords || [];

    // Merge: Map all dates to actual records if they exist, otherwise mark as missing
    const fullAttendanceHistory = allDates.map(date => {
        const dateStr = normalizeDate(date);
        const record = rawAttendance.find(a => normalizeDate(a.date) === dateStr);

        if (record) {
            const actualRemarks = record.remarks || record.remark || '';
            return {
                ...record,
                date: dateStr, // Normalize date string
                remarks: actualRemarks === 'No record found' ? '' : actualRemarks
            };
        }

        return {
            date: dateStr,
            status: 'ABSENT', // Default for missing records
            remarks: '' // Keep empty so it doesn't persist in data
        };
    });

    // Counts - combine saved records with unsaved inline changes to keep UI in sync
    const mergedAttendance = fullAttendanceHistory.map(record => ({
        ...record,
        status: inlineData[record.date]?.status || record.status
    }));

    const presentDays = mergedAttendance.filter(a => a.status?.toUpperCase() === 'PRESENT').length;
    const leaveDays = mergedAttendance.filter(a => a.status?.toUpperCase() === 'LEAVE').length;
    const absentDays = mergedAttendance.filter(a => a.status?.toUpperCase() === 'ABSENT').length;

    const renderSalarySlips = () => (
        <div className="salary-list">
            {employeeSlips.length > 0 ? (
                employeeSlips.map(slip => (
                    <div key={slip._id} className="salary-item">
                        <div className="salary-info">
                            <div className="salary-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                            </div>
                            <div>
                                <span className="salary-month">{monthNames[slip.month - 1]} {slip.year}</span>
                                <span className="salary-date">Uploaded on {new Date(slip.uploadedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button
                            className="download-btn"
                            onClick={() => window.open(slip.fileUrl || slip.url, '_blank')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            View/Download
                        </button>
                    </div>
                ))
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No salary slips found for this employee</div>
            )}
        </div>
    );

    const renderAttendance = () => (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#059669', fontSize: '24px', fontWeight: '700' }}>
                        {presentDays}
                    </div>
                    <div style={{ color: '#059669', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Present Days</div>
                </div>
                <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: '700' }}>
                        {leaveDays}
                    </div>
                    <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Leave Days</div>
                </div>
                <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#3b82f6', fontSize: '24px', fontWeight: '700' }}>
                        {absentDays}
                    </div>
                    <div style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Absent Days</div>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Date</th>
                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fullAttendanceHistory.map((record, index) => {
                            const isUpdating = updatingRow === record.date;

                            // Current values (either from state or from record)
                            const currentStatus = inlineData[record.date]?.status || record.status;
                            const currentRemarks = inlineData[record.date]?.remarks ?? (record.remarks || '');
                            const isMissingRecord = record.status === 'ABSENT' && !record.remarks;

                            return (
                                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>
                                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <select
                                            value={currentStatus}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                handleInlineChange(record.date, 'status', newStatus);
                                                handleMarkAttendance(record.date, newStatus, currentRemarks);
                                            }}
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                padding: '4px 8px',
                                                borderRadius: '20px',
                                                border: '1px solid #e2e8f0',
                                                background: currentStatus === 'PRESENT' ? '#ecfdf5' : currentStatus === 'LEAVE' ? '#fff7ed' : '#fef2f2',
                                                color: currentStatus === 'PRESENT' ? '#059669' : currentStatus === 'LEAVE' ? '#d97706' : '#ef4444',
                                                cursor: 'pointer',
                                                opacity: isUpdating ? 0.6 : 1
                                            }}
                                            disabled={isUpdating}
                                        >
                                            <option value="PRESENT">PRESENT</option>
                                            <option value="LEAVE">LEAVE</option>
                                            <option value="ABSENT">ABSENT</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px 16px', position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={currentRemarks}
                                            onChange={(e) => handleInlineChange(record.date, 'remarks', e.target.value)}
                                            onBlur={() => handleMarkAttendance(record.date, currentStatus, currentRemarks)}
                                            placeholder={isMissingRecord ? "No record found" : "Add remark..."}
                                            onFocus={(e) => {
                                                if (e.target.placeholder === "No record found") {
                                                    e.target.placeholder = "";
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '6px 10px',
                                                fontSize: '13px',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                color: '#64748b',
                                                opacity: isUpdating ? 0.6 : 1
                                            }}
                                            disabled={isUpdating}
                                        />
                                        {isUpdating && (
                                            <span style={{
                                                position: 'absolute',
                                                right: '25px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: '10px',
                                                color: '#6366f1',
                                                fontWeight: '600'
                                            }}>Saving...</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="docs-grid">
            {employee.documents && Object.keys(employee.documents).length > 0 ? (
                Object.entries(employee.documents).map(([key, url]) => (
                    <div key={key} className="doc-card">
                        <div className="doc-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{key.replace('Url', '').toUpperCase()}</h4>
                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>View Document</a>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', gridColumn: '1 / -1' }}>No documents uploaded for this employee</div>
            )}
        </div>
    );

    return (
        <Layout menuItems={menuItems} title="Employee Details">
            <div className="employee-detail-page">
                <button
                    onClick={() => navigate('/admin/employees')}
                    style={{
                        marginBottom: '20px',
                        padding: '8px 16px',
                        background: 'none',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#64748b',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to List
                </button>

                <div className="detail-header">
                    <div className="detail-avatar">
                        {initial}
                    </div>
                    <div className="detail-info">
                        <h2>{fullName}</h2>
                        <p>{designation} • {department}</p>
                        <span className="detail-id">{employee.employeeId}</span>
                    </div>
                </div>

                <div className="detail-tabs">
                    <button
                        className={`detail-tab ${activeTab === 'salary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('salary')}
                    >
                        Salary Slip
                    </button>
                    <button
                        className={`detail-tab ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        Attendance
                    </button>
                    <button
                        className={`detail-tab ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        Documents
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'salary' && renderSalarySlips()}
                    {activeTab === 'attendance' && renderAttendance()}
                    {activeTab === 'documents' && renderDocuments()}
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeDetail;
