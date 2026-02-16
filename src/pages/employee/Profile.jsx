import React from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();

    const menuItems = getEmployeeMenuItems();

    return (
        <Layout menuItems={menuItems} title="My Profile">
            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {user.personalInfo.firstName[0]}{user.personalInfo.lastName[0]}
                    </div>
                    <div className="profile-header-info">
                        <h2>{user.personalInfo.firstName} {user.personalInfo.lastName}</h2>
                        <p className="profile-designation">{user.personalInfo.designation}</p>
                        <span className="profile-badge">{user.employeeId}</span>
                    </div>
                </div>

                <div className="profile-grid">
                    {/* Personal Information */}
                    <div className="profile-section">
                        <h3 className="section-heading">Personal Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{user.personalInfo.firstName} {user.personalInfo.lastName}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Employee ID</span>
                                <span className="info-value">{user.employeeId}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user.personalInfo.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{user.personalInfo.phone}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Date of Birth</span>
                                <span className="info-value">{new Date(user.personalInfo.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="info-label">Address</span>
                                <span className="info-value">{user.personalInfo.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Work Information */}
                    <div className="profile-section">
                        <h3 className="section-heading">Work Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Designation</span>
                                <span className="info-value">{user.personalInfo.designation}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Department</span>
                                <span className="info-value">{user.personalInfo.department}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Joining Date</span>
                                <span className="info-value">{new Date(user.personalInfo.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Status</span>
                                <span className="status-badge active">{user.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    {user.education && user.education.length > 0 && (
                        <div className="profile-section">
                            <h3 className="section-heading">Education</h3>
                            <div className="timeline">
                                {user.education.map((edu, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content">
                                            <h4>{edu.degree}</h4>
                                            <p className="timeline-institution">{edu.institution}</p>
                                            <span className="timeline-year">{edu.yearOfPassing}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {user.experience && user.experience.length > 0 && (
                        <div className="profile-section">
                            <h3 className="section-heading">Previous Experience</h3>
                            <div className="timeline">
                                {user.experience.map((exp, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content">
                                            <h4>{exp.designation}</h4>
                                            <p className="timeline-institution">{exp.companyName}</p>
                                            <span className="timeline-year">{exp.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
