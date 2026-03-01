import React from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';
import { employeeAPI, onboardingAPI } from '../../utils/api';
import './Profile.css';

const Profile = () => {
    const { user, token, loading: authLoading } = useAuth();
    const [profileData, setProfileData] = React.useState(null);
    const [fetching, setFetching] = React.useState(true);
    const [error, setError] = React.useState('');

    // Edit / Delete state
    const [editModal, setEditModal] = React.useState(null); // { type: 'education'|'experience', index: number, data: {} }
    const [saving, setSaving] = React.useState(false);
    const [saveMsg, setSaveMsg] = React.useState('');

    const menuItems = getEmployeeMenuItems();

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

    React.useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.employeeId || !token) return;

            try {
                setFetching(true);
                const response = await employeeAPI.getProfile(token, user.employeeId);

                if (response.success) {
                    const actualData = response.user || response.data || response.employee || (response.personalInfo ? response : null);

                    if (actualData) {
                        setProfileData(actualData);
                    }
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError('Network error fetching profile');
            } finally {
                setFetching(false);
            }
        };

        if (!authLoading && user) {
            fetchProfile();
        }
    }, [user, token, authLoading]);

    if (authLoading || (fetching && !profileData)) {
        return (
            <Layout menuItems={menuItems} title="My Profile">
                <div className="profile-loading">
                    <div className="spinner"></div>
                    <p>Loading your profile details...</p>
                </div>
            </Layout>
        );
    }

    let displayUser = profileData ? { ...user, ...profileData } : user;

    const serverDocs = profileData?.documents;
    const hasServerDocs = serverDocs && (Array.isArray(serverDocs) ? serverDocs.length > 0 : Object.keys(serverDocs).length > 0);
    if (profileData && !hasServerDocs && user.documents) {
        displayUser.documents = user.documents;
    }

    const personalInfo = displayUser.personalInfo || {};

    const rawFullName = personalInfo.fullName || displayUser.fullName ||
        `${personalInfo.firstName || displayUser.firstName || ''} ${personalInfo.lastName || displayUser.lastName || ''}`.trim();
    const displayName = rawFullName || 'N/A';
    const email = personalInfo.email || displayUser.email || 'N/A';
    const phone = personalInfo.phone || displayUser.phone || 'N/A';
    const address = personalInfo.address || displayUser.address || 'N/A';
    const dob = personalInfo.dob || displayUser.dob || null;
    const designation = personalInfo.designation || displayUser.designation || displayUser.role || 'Employee';
    const department = personalInfo.department || displayUser.department || 'N/A';
    const joiningDate = personalInfo.joiningDate || displayUser.joiningDate || null;
    const status = displayUser.status || personalInfo.status || 'Active';

    let initials = 'U';
    if (rawFullName && rawFullName !== 'N/A') {
        const parts = rawFullName.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts.length === 1) {
            initials = parts[0][0].toUpperCase();
        }
    } else if (displayUser.employeeId) {
        initials = displayUser.employeeId[0].toUpperCase();
    }

    const formatDate = (dateString) => {
        if (!dateString || dateString === 'Present') return dateString || 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // --- Edit / Delete Handlers ---
    const openEdit = (type, index) => {
        const data = type === 'education'
            ? { ...displayUser.education[index] }
            : { ...displayUser.experience[index] };
        setEditModal({ type, index, data });
        setSaveMsg('');
    };

    const closeEdit = () => setEditModal(null);

    const handleEditChange = (field, value) => {
        setEditModal(prev => ({ ...prev, data: { ...prev.data, [field]: value } }));
    };

    const saveEdit = async () => {
        setSaving(true);
        try {
            const updatedEducation = [...(displayUser.education || [])];
            const updatedExperience = [...(displayUser.experience || [])];

            if (editModal.type === 'education') {
                updatedEducation[editModal.index] = editModal.data;
            } else {
                updatedExperience[editModal.index] = editModal.data;
            }

            const res = await onboardingAPI.submit(token, {
                education: updatedEducation,
                experience: updatedExperience,
            });

            if (res.success || res.message?.toLowerCase().includes('success')) {
                setProfileData(prev => ({
                    ...prev,
                    education: updatedEducation,
                    experience: updatedExperience,
                }));
                setSaveMsg('Saved successfully!');
                setTimeout(() => { closeEdit(); setSaveMsg(''); }, 1000);
            } else {
                setSaveMsg(res.message || 'Failed to save. Please try again.');
            }
        } catch (err) {
            setSaveMsg('Network error saving changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (type, index) => {
        if (!window.confirm(`Delete this ${type} entry?`)) return;

        const updatedEducation = [...(displayUser.education || [])];
        const updatedExperience = [...(displayUser.experience || [])];

        if (type === 'education') {
            updatedEducation.splice(index, 1);
        } else {
            updatedExperience.splice(index, 1);
        }

        try {
            const res = await onboardingAPI.submit(token, {
                education: updatedEducation,
                experience: updatedExperience,
            });

            if (res.success || res.message?.toLowerCase().includes('success')) {
                setProfileData(prev => ({
                    ...prev,
                    education: updatedEducation,
                    experience: updatedExperience,
                }));
            } else {
                alert(res.message || 'Failed to delete. Please try again.');
            }
        } catch (err) {
            alert('Network error deleting entry.');
        }
    };

    // --- Styles ---
    const cardBtnBase = {
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
    };

    return (
        <Layout menuItems={menuItems} title="My Profile">
            <div className="profile-page">
                {error && <div className="profile-error-banner">{error}</div>}
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {initials}
                    </div>
                    <div className="profile-header-info">
                        <h2>{displayName}</h2>
                        <p className="profile-designation">{designation}</p>
                        <span className="profile-badge">{displayUser.employeeId}</span>
                    </div>
                </div>

                <div className="profile-grid">
                    {/* Personal Information */}
                    <div className="profile-section">
                        <h3 className="section-heading">Personal Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{displayName}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Employee ID</span>
                                <span className="info-value">{displayUser.employeeId}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{phone}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Date of Birth</span>
                                <span className="info-value">{formatDate(dob)}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="info-label">Address</span>
                                <span className="info-value">{address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Work Information */}
                    <div className="profile-section">
                        <h3 className="section-heading">Work Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Designation</span>
                                <span className="info-value">{designation}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Department</span>
                                <span className="info-value">{department}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Joining Date</span>
                                <span className="info-value">{formatDate(joiningDate)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Status</span>
                                <span className={`status-badge ${status.toLowerCase() === 'active' ? 'active' : ''}`}>
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    {displayUser.education && displayUser.education.length > 0 && (
                        <div className="profile-section">
                            <h3 className="section-heading">Education</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {displayUser.education.map((edu, index) => (
                                    <div key={index} style={{
                                        padding: '20px',
                                        borderRadius: '12px',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        position: 'relative'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
                                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                                </svg>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{edu.degree || 'Degree'}</h4>
                                                {edu.field && <span style={{ fontSize: '13px', color: '#4f46e5', fontWeight: '500', display: 'block' }}>Field: {edu.field}</span>}
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                                    Year: {edu.startYear ? `${edu.startYear} - ` : ''}{edu.endYear || edu.yearOfPassing || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#334155', fontWeight: '500' }}>Institution: {edu.institution || 'N/A'}</p>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => openEdit('education', index)} style={{ ...cardBtnBase, background: '#e0f2fe', color: '#0369a1' }}>
                                                    ✏️ Edit
                                                </button>
                                                <button onClick={() => handleDelete('education', index)} style={{ ...cardBtnBase, background: '#fee2e2', color: '#dc2626' }}>
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {displayUser.experience && displayUser.experience.length > 0 && (
                        <div className="profile-section">
                            <h3 className="section-heading">Previous Experience</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {displayUser.experience.map((exp, index) => {
                                    let durationDisplay = 'N/A';
                                    if (exp.startDate) {
                                        durationDisplay = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate) || 'Present'}`;
                                    } else if (exp.duration) {
                                        if (exp.duration.includes(' - ')) {
                                            const [start, end] = exp.duration.split(' - ');
                                            durationDisplay = `${formatDate(start)} - ${formatDate(end)}`;
                                        } else {
                                            durationDisplay = exp.duration;
                                        }
                                    }
                                    return (
                                        <div key={index} style={{
                                            padding: '20px',
                                            borderRadius: '12px',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                                    </svg>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{exp.designation || exp.role || 'Professional Experience'}</h4>
                                                    <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '500', display: 'block' }}>
                                                        Company: {exp.companyName || exp.company || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>Duration: {durationDisplay}</p>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => openEdit('experience', index)} style={{ ...cardBtnBase, background: '#e0f2fe', color: '#0369a1' }}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button onClick={() => handleDelete('experience', index)} style={{ ...cardBtnBase, background: '#fee2e2', color: '#dc2626' }}>
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {displayUser.documents && (Array.isArray(displayUser.documents) ? displayUser.documents.length > 0 : Object.keys(displayUser.documents).length > 0) && (
                        <div className="profile-section">
                            <h3 className="section-heading">Documents</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                                {(() => {
                                    const docs = displayUser.documents;
                                    const getDocLabel = (url, index) => {
                                        if (typeof url !== 'string') return `Document ${index + 1}`;
                                        const raw = decodeURIComponent(url.split('/').pop().split('?')[0]);
                                        if (raw.includes('.')) return raw;
                                        return index === 0 ? 'KYC Document' : 'Professional Resume';
                                    };
                                    const docEntries = Array.isArray(docs)
                                        ? docs.map((doc, i) => {
                                            const url = typeof doc === 'string' ? doc : (doc.url || doc.fileUrl || '#');
                                            const label = (typeof doc === 'object' && (doc.name || doc.originalName))
                                                ? (doc.name || doc.originalName)
                                                : getDocLabel(url, i);
                                            return { label, url };
                                        })
                                        : Object.entries(docs).map(([key, url]) => {
                                            const labelMap = { kycUrl: 'KYC Document', resumeUrl: 'Professional Resume' };
                                            return { label: labelMap[key] || key, url };
                                        });

                                    return docEntries.map(({ label, url }, index) => {
                                        if (!url || url === '#') return null;
                                        return (
                                            <div key={index} style={{ padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                    </svg>
                                                </div>
                                                <div style={{ overflow: 'hidden', flex: 1 }}>
                                                    <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</h4>
                                                    <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#94a3b8' }}>PDF Document</p>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleView(url)} style={{ ...cardBtnBase, background: '#e0f2fe', color: '#0369a1' }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            View
                                                        </button>
                                                        <button onClick={() => handleDownload(url, label + '.pdf')} style={{ ...cardBtnBase, background: '#d1fae5', color: '#065f46' }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {editModal && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, backdropFilter: 'blur(4px)'
                    }}>
                        <div style={{
                            background: '#fff', borderRadius: '16px', padding: '32px',
                            width: '95%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                        }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#1e293b' }}>
                                Edit {editModal.type === 'education' ? 'Education' : 'Experience'}
                            </h3>

                            {editModal.type === 'education' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { label: 'Institution', field: 'institution' },
                                        { label: 'Degree', field: 'degree' },
                                        { label: 'Field of Study', field: 'field' },
                                        { label: 'Start Year', field: 'startYear' },
                                        { label: 'End Year', field: 'endYear' },
                                    ].map(({ label, field }) => (
                                        <div key={field}>
                                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
                                            <input
                                                value={editModal.data[field] || ''}
                                                onChange={e => handleEditChange(field, e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { label: 'Company Name', field: 'companyName' },
                                        { label: 'Designation / Role', field: 'designation' },
                                        { label: 'Start Date', field: 'startDate', type: 'date' },
                                        { label: 'End Date (leave blank if current)', field: 'endDate', type: 'date' },
                                    ].map(({ label, field, type = 'text' }) => (
                                        <div key={field}>
                                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
                                            <input
                                                type={type}
                                                value={editModal.data[field] || ''}
                                                onChange={e => handleEditChange(field, e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {saveMsg && (
                                <p style={{ marginTop: '12px', fontSize: '13px', color: saveMsg.includes('success') ? '#16a34a' : '#dc2626', fontWeight: '500' }}>
                                    {saveMsg}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                                <button onClick={closeEdit} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button onClick={saveEdit} disabled={saving} style={{
                                    padding: '10px 24px', borderRadius: '8px', border: 'none',
                                    background: saving ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer'
                                }}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Profile;
