import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { employees } from '../../utils/dummyData';
import { getAdminMenuItems } from '../../utils/menuConfig.jsx';
import { useAuth } from '../../context/AuthContext';
import { employeeAPI } from '../../utils/api';

const EmployeeManagement = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'EMPLOYEE'
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const menuItems = getAdminMenuItems();

    const fetchEmployees = async () => {
        try {
            const data = await employeeAPI.getAll(token, searchTerm);
            const list = Array.isArray(data) ? data : (data.employees || data.data || []);
            setEmployeeList(list);
        } catch (err) {
            console.error('Error fetching employees:', err);
        } finally {
            setFetching(false);
        }
    };

    React.useEffect(() => {
        if (token) {
            const timer = setTimeout(() => {
                fetchEmployees();
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setFetching(false);
        }
    }, [token, searchTerm]);

    const filteredEmployees = employeeList;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            role: 'EMPLOYEE'
        });
        setEditingEmployee(null);
        setIsModalOpen(false);
        setError('');
        setSuccess('');
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            fullName: employee.personalInfo?.fullName || `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`.trim(),
            email: employee.personalInfo?.email || '',
            phone: employee.personalInfo?.phone || '',
            role: employee.role || 'EMPLOYEE'
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setDeleteError('');
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`http://64.227.146.144:3001/api/v1/admin/employees/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setEmployeeList(prev => prev.filter(emp => emp._id !== deleteId));
                setSuccess('Employee deleted successfully');
                setDeleteId(null);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setDeleteError(data.message || 'Failed to delete employee');
            }
        } catch (err) {
            console.error('Error deleting employee:', err);
            setDeleteError('Failed to delete employee');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                personalInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone
                },
                role: formData.role
            };

            const url = editingEmployee
                ? `http://64.227.146.144:3001/api/v1/admin/employees/${editingEmployee._id}`
                : 'http://64.227.146.144:3001/api/v1/admin/employees';

            const method = editingEmployee ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!');
                fetchEmployees(); // Refresh list to get exact server state

                setTimeout(() => {
                    resetForm();
                }, 1500);
            } else {
                setError(data.message || (editingEmployee ? 'Failed to update employee' : 'Failed to add employee'));
            }
        } catch (err) {
            console.error('Error saving employee:', err);
            setError('Network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout menuItems={menuItems} title="Employee Management">
            <div className="container-responsive">
                <div className="flex-responsive" style={{ justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} viewBox="0 0 24 24" fill="none">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, ID or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 14px 14px 50px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '14px 24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '700',
                            boxShadow: '0 4px 12px rgba(118, 75, 162, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Add Employee
                    </button>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    {fetching ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading employees...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Employee</th>
                                        <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>ID</th>
                                        <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Role & Dept</th>
                                        <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((emp) => (
                                        <tr key={emp._id || emp.employeeId} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: '700' }}>
                                                        {emp.personalInfo?.firstName?.[0] || emp.personalInfo?.fullName?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                                                            {emp.personalInfo?.fullName || `${emp.personalInfo?.firstName} ${emp.personalInfo?.lastName}`}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.personalInfo?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>{emp.employeeId}</span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{emp.personalInfo?.designation || 'N/A'}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.personalInfo?.department || 'N/A'}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    background: emp.status === 'ACTIVE' ? '#ecfdf5' : '#fff7ed',
                                                    color: emp.status === 'ACTIVE' ? '#059669' : '#d97706',
                                                    textTransform: 'uppercase'
                                                }}>{emp.status || 'ACTIVE'}</span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => navigate(`/admin/employees/${emp.employeeId}`)} style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#3b82f6', cursor: 'pointer' }} title="View Details">
                                                        <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleEdit(emp)} style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', cursor: 'pointer' }}>
                                                        <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none">
                                                            <path d="M11 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V14M16.2426 3.75736C17.0237 2.97631 18.2899 2.97631 19.0711 3.75736C19.8521 4.53841 19.8521 5.80474 19.0711 6.58579L9 16.6569L5 17.6569L6 13.6569L16.2426 3.75736Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(emp._id)} style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}>
                                                        <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none">
                                                            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Employee Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '500px',
                        padding: '32px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
                            <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{ padding: '12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                    placeholder="e.g. Punam Kumari"
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                    placeholder="e.g. punam@company.com"
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                    placeholder="e.g. 7654217449"
                                />
                            </div>



                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? 'Saving...' : (editingEmployee ? 'Update Employee' : 'Add Employee')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '400px',
                        padding: '32px',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: '#fee2e2',
                                color: '#ef4444',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>Confirm Delete</h3>
                            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                                Are you sure you want to delete this employee? This action cannot be undone.
                            </p>
                        </div>

                        {deleteError && (
                            <div style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                                {deleteError}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setDeleteId(null)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: '#ef4444',
                                    color: 'white',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default EmployeeManagement;

