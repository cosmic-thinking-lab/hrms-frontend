import React from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';
import { employeeAPI } from '../../utils/api';
import './Profile.css';

const Profile = () => {
    const { user, token, loading: authLoading } = useAuth();
    const [profileData, setProfileData] = React.useState(null);
    const [fetching, setFetching] = React.useState(true);
    const [error, setError] = React.useState('');

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
                console.log('DEBUG: Profile API Response:', response);

                if (response.success) {
                    // MAPPING FIX: The API returns { success: true, user: { ... } }
                    const actualData = response.user || response.data || response.employee || (response.personalInfo ? response : null);
                    console.log('DEBUG: Mapped Profile Data:', actualData);

                    if (actualData) {
                        setProfileData(actualData);
                    } else {
                        console.warn('DEBUG: No profile data found in success response');
                    }
                } else {
                    console.error('Failed to fetch profile:', response.message);
                    setError(response.message);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Network error updating profile details');
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

    // Merge context user with fresh API data
    // We prioritize profileData (server truth) but fall back to local user state for volatile fields like docs
    let displayUser = profileData ? { ...user, ...profileData } : user;

    // PROTECTION: If server returns empty/no documents but local user has them (from onboarding), keep local ones
    const serverDocs = profileData?.documents;
    const hasServerDocs = serverDocs && (Array.isArray(serverDocs) ? serverDocs.length > 0 : Object.keys(serverDocs).length > 0);
    if (profileData && !hasServerDocs && user.documents) {
        displayUser.documents = user.documents;
    }

    const personalInfo = displayUser.personalInfo || {};

    // EXHAUSTIVE FIELD MAPPING (Checking both personalInfo and root levels)
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

    // Generate initials from fullName or employeeId
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

    const formatDate = (dateString, includeDay = true) => {
        if (!dateString || dateString === 'Present') return dateString || 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const options = includeDay
            ? { year: 'numeric', month: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'short' };

        return date.toLocaleDateString('en-US', options);
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
                            <div className="education-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {displayUser.education.map((edu, index) => (
                                    <div key={index} className="education-card" style={{
                                        padding: '20px',
                                        borderRadius: '12px',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        transition: 'transform 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                background: '#e0e7ff',
                                                color: '#4f46e5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
                                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{edu.degree || 'Degree'}</h4>
                                                {edu.field && <span style={{ fontSize: '13px', color: '#4f46e5', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Field: {edu.field}</span>}
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                                    Year: {edu.startYear ? `${edu.startYear} - ` : ''}{edu.endYear || edu.yearOfPassing || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#334155', fontWeight: '500' }}>Institution: {edu.institution || 'N/A'}</p>
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
                            <div className="experience-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {displayUser.experience.map((exp, index) => {
                                    // Robustly format duration display
                                    let durationDisplay = 'N/A';
                                    if (exp.startDate) {
                                        durationDisplay = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate) || 'Present'}`;
                                    } else if (exp.duration) {
                                        // If only duration exists, try to split and format if it's "ISO - ISO"
                                        if (exp.duration.includes(' - ')) {
                                            const [start, end] = exp.duration.split(' - ');
                                            durationDisplay = `${formatDate(start)} - ${formatDate(end)}`;
                                        } else {
                                            durationDisplay = exp.duration;
                                        }
                                    }

                                    return (
                                        <div key={index} className="experience-card" style={{
                                            padding: '20px',
                                            borderRadius: '12px',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            transition: 'transform 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    background: '#f0fdf4',
                                                    color: '#16a34a',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{exp.designation || exp.role || 'Professional Experience'}</h4>
                                                    <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '500', display: 'block', marginBottom: '2px' }}>
                                                        Company: {exp.companyName || exp.company || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                                    Duration: {durationDisplay}
                                                </p>
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
                            <div className="documents-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
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
                                            <div key={index} className="document-card" style={{
                                                padding: '20px',
                                                borderRadius: '12px',
                                                background: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px'
                                            }}>
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '12px',
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                                        <polyline points="10 9 9 9 8 9"></polyline>
                                                    </svg>
                                                </div>
                                                <div style={{ overflow: 'hidden', flex: 1 }}>
                                                    <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {label}
                                                    </h4>
                                                    <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#94a3b8' }}>PDF Document</p>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleView(url)} style={{
                                                            fontSize: '12px', color: '#0369a1', background: '#e0f2fe',
                                                            padding: '4px 12px', borderRadius: '20px', fontWeight: '600',
                                                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            border: 'none', cursor: 'pointer'
                                                        }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            View
                                                        </button>
                                                        <button onClick={() => handleDownload(url, label + '.pdf')} style={{
                                                            fontSize: '12px', color: '#065f46', background: '#d1fae5',
                                                            padding: '4px 12px', borderRadius: '20px', fontWeight: '600',
                                                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            border: 'none', cursor: 'pointer'
                                                        }}>
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
            </div>
        </Layout>
    );
};

export default Profile;
