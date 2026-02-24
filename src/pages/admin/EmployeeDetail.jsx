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
    const [inlineData, setInlineData] = useState({}); // { [date]: { status, remarks } }
    const [attendanceRecords, setAttendanceRecords] = useState([]); // Real attendance data
    const [isAttModalOpen, setIsAttModalOpen] = useState(false);
    const [attFormData, setAttFormData] = useState({ date: '', status: 'PRESENT', remarks: '' });
    const [attSaving, setAttSaving] = useState(false);

    const handleDownload = async (url, filename = 'document.pdf') => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            window.open(url, '_blank');
        }
    };

    const handleView = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new Blob([blob], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        } catch (err) {
            window.open(url, '_blank');
        }
    };



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

    const handleMarkAttendance = async (e) => {
        if (e) e.preventDefault();
        console.log('--- ATTENDANCE MARK START ---');
        setAttSaving(true);
        try {
            const payload = {
                employeeId: id,
                _id: employee?._id,
                date: attFormData.date,
                status: attFormData.status,
                remarks: attFormData.remarks,
                remark: attFormData.remarks
            };
            console.log('API Payload:', payload);

            const response = await attendanceAPI.mark(token, payload);
            console.log('API Response:', response);

            if (response.success || response.data || response._id) {
                console.log('Marking Success. Refreshing data...');
                const attData = await attendanceAPI.getByEmployeeId(token, id);
                if (attData && attData.success !== false) {
                    const records = attData.records || attData.data || attData.attendance || (Array.isArray(attData) ? attData : []);
                    setAttendanceRecords(records);
                    setIsAttModalOpen(false);
                    setAttFormData({ date: '', status: 'PRESENT', remarks: '' });
                    console.log('Data Refreshed Successfully');
                }
            } else {
                alert(`Error: ${response.message || 'Operation failed'}`);
            }
        } catch (err) {
            console.error('Error marking attendance:', err);
        } finally {
            setAttSaving(null);
            console.log('--- ATTENDANCE MARK END ---');
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

    // Generate full attendance history from joining date (or account creation date) to now
    const joiningDate = employee.personalInfo?.joiningDate || employee.joiningDate || employee.createdAt || new Date().toISOString();
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
                            onClick={() => handleView(slip.fileUrl || slip.url)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flex: 1 }}>
                    <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ color: '#059669', fontSize: '24px', fontWeight: '700' }}>{presentDays}</div>
                        <div style={{ color: '#059669', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Present Days</div>
                    </div>
                    <div style={{ padding: '16px', background: '#fff7ed', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ color: '#d97706', fontSize: '24px', fontWeight: '700' }}>{leaveDays}</div>
                        <div style={{ color: '#d97706', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Leave Days</div>
                    </div>
                    <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: '700' }}>{absentDays}</div>
                        <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Absent Days</div>
                    </div>
                </div>
                <button
                    onClick={() => setIsAttModalOpen(true)}
                    style={{
                        marginLeft: '24px',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(118, 75, 162, 0.2)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Mark Attendance
                </button>
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
                        {fullAttendanceHistory.map((record, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>
                                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        background: record.status === 'PRESENT' ? '#ecfdf5' : record.status === 'LEAVE' ? '#fff7ed' : '#fef2f2',
                                        color: record.status === 'PRESENT' ? '#059669' : record.status === 'LEAVE' ? '#d97706' : '#ef4444',
                                        textTransform: 'uppercase'
                                    }}>
                                        {record.status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                                    {record.remarks || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>No remarks</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAttModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', width: '90%', maxWidth: '400px',
                        padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Mark Attendance</h3>
                        <form onSubmit={handleMarkAttendance}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Date</label>
                                <input
                                    type="date"
                                    required
                                    value={attFormData.date}
                                    onChange={(e) => setAttFormData({ ...attFormData, date: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Status</label>
                                <select
                                    value={attFormData.status}
                                    onChange={(e) => setAttFormData({ ...attFormData, status: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                >
                                    <option value="PRESENT">PRESENT</option>
                                    <option value="LEAVE">LEAVE</option>
                                    <option value="ABSENT">ABSENT</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Remarks</label>
                                <input
                                    type="text"
                                    value={attFormData.remarks}
                                    onChange={(e) => setAttFormData({ ...attFormData, remarks: e.target.value })}
                                    placeholder="Enter remarks..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsAttModalOpen(false)}
                                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={attSaving}
                                    style={{
                                        flex: 1, padding: '10px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600',
                                        cursor: attSaving ? 'not-allowed' : 'pointer',
                                        opacity: attSaving ? 0.7 : 1
                                    }}
                                >
                                    {attSaving ? 'Saving...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const renderDocuments = () => {
        const docs = employee.documents;
        const hasDocuments = docs && (
            (Array.isArray(docs) && docs.length > 0) ||
            (!Array.isArray(docs) && typeof docs === 'object' && Object.keys(docs).length > 0)
        );

        if (!hasDocuments) {
            return (
                <div className="docs-grid">
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', gridColumn: '1 / -1' }}>No documents uploaded for this employee</div>
                </div>
            );
        }

        // Normalize documents to array format
        let docList = [];
        if (Array.isArray(docs)) {
            // API format: can be array of objects [{name, url...}] or array of strings (URLs)
            docList = docs.map((doc, i) => {
                const isString = typeof doc === 'string';
                let label = `Document ${i + 1}`;
                if (isString) {
                    const filename = doc.split('/').pop().replace(/_/g, ' ').toUpperCase();
                    label = filename.includes('KYC') ? 'KYC DOCUMENTS' :
                        filename.includes('RESUME') ? 'PROFESSIONAL RESUME' :
                            `DOC: ${filename.substring(0, 15)}${filename.length > 15 ? '...' : ''}`;
                } else {
                    label = doc.name || doc.originalName || doc.type || `Document ${i + 1}`;
                }
                return {
                    key: !isString ? (doc._id || doc.name || `doc-${i}`) : `doc-${i}`,
                    label: label,
                    url: isString ? doc : (doc.url || doc.fileUrl || doc.path || '#')
                };
            });
        } else {
            // Object format from dummy data: { kycUrl: '...', resumeUrl: '...' }
            docList = Object.entries(docs).map(([key, url]) => ({
                key,
                label: key.replace('Url', '').toUpperCase(),
                url
            }));
        }

        return (
            <div className="docs-grid">
                {docList.map(doc => (
                    <div key={doc.key} className="doc-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div className="doc-icon" style={{ background: '#fee2e2', color: '#dc2626', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.label}</h4>
                            <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8' }}>PDF Document</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleView(doc.url)} style={{
                                    fontSize: '12px', color: '#0369a1', background: '#e0f2fe',
                                    padding: '3px 10px', borderRadius: '20px', fontWeight: '600',
                                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    border: 'none', cursor: 'pointer'
                                }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    View
                                </button>
                                <button onClick={() => handleDownload(doc.url, doc.label + '.pdf')} style={{
                                    fontSize: '12px', color: '#065f46', background: '#d1fae5',
                                    padding: '3px 10px', borderRadius: '20px', fontWeight: '600',
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    border: 'none', cursor: 'pointer'
                                }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

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
