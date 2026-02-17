import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAdminMenuItems } from '../../utils/menuConfig.jsx';
import { useAuth } from '../../context/AuthContext';
import { employeeAPI, payrollAPI } from '../../utils/api';

const SalaryUpload = () => {
    const { token } = useAuth();
    const menuItems = getAdminMenuItems();
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await employeeAPI.getAll(token);
                const list = Array.isArray(data) ? data : (data.employees || data.data || []);
                setEmployeeList(list);
            } catch (err) {
                console.error('Error fetching employees:', err);
            } finally {
                setFetching(false);
            }
        };

        if (token) {
            fetchEmployees();
        }
    }, [token]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedEmployee || !file || !month || !year) {
            setStatus('Please fill all fields and select a file');
            return;
        }

        setStatus('Uploading salary slip...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('employeeId', selectedEmployee);
        formData.append('month', month);
        formData.append('year', year);

        try {
            const response = await payrollAPI.upload(token, formData);
            if (response.success) {
                setStatus('Salary slip uploaded successfully! 💸');
                setFile(null);
                setSelectedEmployee('');
            } else {
                setStatus(`Upload failed: ${response.message || 'Unknown error'} ${response.status ? `(Status: ${response.status})` : ''}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setStatus('Error connecting to server. Please check your connection.');
        }
    };

    return (
        <Layout menuItems={menuItems} title="Salary Upload">
            <div className="container-responsive">
                <div className="card-responsive" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Upload New Salary Slip</h2>

                    <form onSubmit={handleUpload} style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Select Employee (ID or Name)</label>
                            <input
                                list="employee-list"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                placeholder={fetching ? 'Loading employees...' : 'Search Name or Type ID directly'}
                                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }}
                            />
                            <datalist id="employee-list">
                                {employeeList.map(emp => (
                                    <option key={emp._id || emp.employeeId} value={emp.employeeId}>
                                        {emp.personalInfo?.firstName} {emp.personalInfo?.lastName} ({emp.employeeId})
                                    </option>
                                ))}
                            </datalist>
                        </div>

                        <div className="grid-2-col" style={{ gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Month</label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en-US', { month: 'long' })}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Year</label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }}
                                >
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Upload Salary Slip (PDF)</label>
                            <div style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }} onClick={() => document.getElementById('file-upload').click()}>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                                <svg style={{ width: '32px', height: '32px', color: '#64748b', marginBottom: '8px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 5v12" />
                                </svg>
                                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                                    {file ? file.name : 'Click to select or drag PDF file'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: '12px',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                borderRadius: '10px',
                                fontWeight: '700',
                                boxShadow: '0 4px 12px rgba(118, 75, 162, 0.2)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '15px'
                            }}
                        >
                            Generate & Upload Slip
                        </button>

                        {status && (
                            <p style={{
                                textAlign: 'center',
                                color: status.includes('successfully') ? '#10b981' : '#f59e0b',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                {status}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default SalaryUpload;
