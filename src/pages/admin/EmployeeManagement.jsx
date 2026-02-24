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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        designation: '',
        department: '',
        joiningDate: '',
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
            dateOfBirth: '',
            address: '',
            designation: '',
            department: '',
            joiningDate: '',
            role: 'EMPLOYEE'
        });
        setEditingEmployee(null);
        setIsModalOpen(false);
        setError('');
        setSuccess('');
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        const dob = employee.personalInfo?.dateOfBirth;
        const joining = employee.personalInfo?.joiningDate;
        setFormData({
            fullName: employee.personalInfo?.fullName || `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`.trim(),
            email: employee.personalInfo?.email || '',
            phone: employee.personalInfo?.phone || '',
            dateOfBirth: dob ? dob.split('T')[0] : '',
            address: employee.personalInfo?.address || '',
            designation: employee.personalInfo?.designation || '',
            department: employee.personalInfo?.department || '',
            joiningDate: joining ? joining.split('T')[0] : '',
            role: employee.role || 'EMPLOYEE'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const [firstName = '', ...lastNameParts] = formData.fullName.split(' ');
            const lastName = lastNameParts.join(' ');

            const payload = {
                personalInfo: {
                    fullName: formData.fullName,
                    firstName: firstName,
                    lastName: lastName,
                    email: formData.email,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth || undefined,
                    address: formData.address || undefined,
                    designation: formData.designation || undefined,
                    department: formData.department || undefined,
                    joiningDate: formData.joiningDate || undefined
                },
                fullName: formData.fullName,
                firstName: firstName,
                lastName: lastName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role
            };

            let response;
            if (editingEmployee) {
                response = await employeeAPI.update(token, editingEmployee.employeeId, payload);
                console.log('Update result:', response);
            } else {
                response = await employeeAPI.create(token, payload);
            }

            // More flexible success check
            const isSuccess = response.success ||
                response.message?.toLowerCase().includes('success') ||
                response.status === 200 ||
                response._id;

            if (isSuccess) {
                setSuccess(response.message || (editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!'));
                setError('');
                fetchEmployees();

                setTimeout(() => {
                    resetForm();
                }, 2000);
            } else {
                setError(response.message || 'Operation failed');
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
                                                    <button onClick={() => handleEdit(emp)} style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', cursor: 'pointer' }} title="Edit Details">
                                                        <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none">
                                                            <path d="M11 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V14M16.2426 3.75736C17.0237 2.97631 18.2899 2.97631 19.0711 3.75736C19.8521 4.53841 19.8521 5.80474 19.0711 6.58579L9 16.6569L5 17.6569L6 13.6569L16.2426 3.75736Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                        maxWidth: '600px',
                        padding: '32px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        maxHeight: '90vh',
                        overflowY: 'auto'
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Joining Date</label>
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}
                                        placeholder="e.g. Software Engineer"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}
                                        placeholder="e.g. Engineering"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={2}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px', boxSizing: 'border-box' }}
                                    placeholder="e.g. 123 Main St, City, State"
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
        </Layout>
    );
};

export default EmployeeManagement;

