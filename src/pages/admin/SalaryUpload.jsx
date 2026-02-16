import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { getAdminMenuItems } from '../../utils/menuConfig.jsx';
import { employees } from '../../utils/dummyData';

const SalaryUpload = () => {
    const menuItems = getAdminMenuItems();
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [baseSalary, setBaseSalary] = useState('');
    const [status, setStatus] = useState('');

    const handleUpload = (e) => {
        e.preventDefault();
        if (!selectedEmployee || !baseSalary) {
            setStatus('Please fill all fields');
            return;
        }

        setStatus('Uploading salary slip...');
        setTimeout(() => {
            setStatus('Salary slip uploaded successfully for employee ' + selectedEmployee + '! 💸');
            setBaseSalary('');
        }, 1500);
    };

    return (
        <Layout menuItems={menuItems} title="Salary Upload">
            <div className="container-responsive">
                <div className="card-responsive" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Upload New Salary Slip</h2>

                    <form onSubmit={handleUpload} style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Select Employee</label>
                            <select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }}
                            >
                                <option value="">Choose an employee</option>
                                {employees.map(emp => (
                                    <option key={emp.employeeId} value={emp.employeeId}>
                                        {emp.personalInfo.firstName} {emp.personalInfo.lastName} ({emp.employeeId})
                                    </option>
                                ))}
                            </select>
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
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Base Salary (₹)</label>
                            <input
                                type="number"
                                value={baseSalary}
                                onChange={(e) => setBaseSalary(e.target.value)}
                                placeholder="Enter amount"
                                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }}
                            />
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
