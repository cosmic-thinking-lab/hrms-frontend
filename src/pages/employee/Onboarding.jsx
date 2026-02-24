import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';
import { onboardingAPI } from '../../utils/api'; // Import API
import { useAuth } from '../../context/AuthContext'; // Import Auth Context
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const menuItems = getEmployeeMenuItems();
    const { user, token, updateUser } = useAuth(); // Get user, token and updateUser
    const navigate = useNavigate();

    // State for sections
    const [activeSection, setActiveSection] = useState('education'); // 'education', 'experience', 'documents'
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State for Education
    const [education, setEducation] = useState([
        { institution: '', degree: '', field: '', startYear: '', endYear: '' }
    ]);

    // State for Experience
    const [experience, setExperience] = useState([
        { company: '', role: '', startDate: '', endDate: '' }
    ]);

    // Load existing data when user is available
    useEffect(() => {
        if (user) {
            console.log("Onboarding: Loading user data", user);
            if (user.education && user.education.length > 0) {
                console.log("Onboarding: Setting education", user.education);
                setEducation(user.education.map(e => ({
                    institution: e.institution || '',
                    degree: e.degree || '',
                    field: e.field || '',
                    startYear: e.startYear || '',
                    endYear: e.endYear || e.yearOfPassing || ''
                })));
            } else {
                console.log("Onboarding: No existing education data found");
            }

            if (user.experience && user.experience.length > 0) {
                console.log("Onboarding: Setting experience", user.experience);
                setExperience(user.experience.map(e => ({
                    company: e.companyName || e.company || '',
                    role: e.designation || e.role || '',
                    startDate: e.startDate || '',
                    endDate: e.endDate || ''
                })));
            }
        }
    }, [user]);


    // State for Documents
    const [kycFile, setKycFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const kycInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    // Extra documents (dynamic)
    const [extraDocs, setExtraDocs] = useState([]); // [{ name: '', file: null }]

    const addExtraDoc = () => {
        setExtraDocs([...extraDocs, { name: '', file: null }]);
    };

    const removeExtraDoc = (index) => {
        const list = [...extraDocs];
        list.splice(index, 1);
        setExtraDocs(list);
    };

    const handleExtraDocName = (index, value) => {
        const list = [...extraDocs];
        list[index].name = value;
        setExtraDocs(list);
    };

    const handleExtraDocFile = (index, file) => {
        const list = [...extraDocs];
        list[index].file = file;
        setExtraDocs(list);
    };


    // --- Handlers for Education ---
    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...education];
        list[index][name] = value;
        setEducation(list);
    };

    const addEducation = () => {
        setEducation([...education, { institution: '', degree: '', field: '', startYear: '', endYear: '' }]);
    };

    const removeEducation = (index) => {
        const list = [...education];
        list.splice(index, 1);
        setEducation(list);
    };

    // --- Handlers for Experience ---
    const handleExperienceChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...experience];
        list[index][name] = value;
        setExperience(list);
    };

    const addExperience = () => {
        setExperience([...experience, { company: '', role: '', startDate: '', endDate: '' }]);
    };

    const removeExperience = (index) => {
        const list = [...experience];
        list.splice(index, 1);
        setExperience(list);
    };

    // --- Handlers for Documents ---
    const handleKycClick = () => kycInputRef.current.click();
    const handleResumeClick = () => resumeInputRef.current.click();

    const handleKycChange = (e) => {
        if (e.target.files[0]) setKycFile(e.target.files[0]);
    };

    const handleResumeChange = (e) => {
        if (e.target.files[0]) setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Basic Validation
        if (activeSection === 'documents' && (!kycFile || !resumeFile)) {
            setMessage({ type: 'error', text: 'Please upload both KYC and Resume documents.' });
            setLoading(false);
            return;
        }

        try {
            const filteredEducation = education.filter(e => e.institution && e.degree);
            const filteredExperience = experience.filter(e => e.company && e.role);

            let response;

            if (kycFile || resumeFile || extraDocs.some(d => d.file)) {
                // Use FormData (multipart) when files are present
                response = await onboardingAPI.submitWithFiles(token, {
                    education: filteredEducation,
                    experience: filteredExperience,
                    kycFile: kycFile,
                    resumeFile: resumeFile,
                    extraFiles: extraDocs.filter(d => d.file).map(d => ({ name: d.name || 'Document', file: d.file }))
                });
            } else {
                // Use JSON when no files
                response = await onboardingAPI.submit(token, {
                    education: filteredEducation,
                    experience: filteredExperience
                });
            }

            console.log('Onboarding response:', response);

            if (response.success || response.message?.toLowerCase().includes('success')) {
                // Update local user context with the server response data
                const updatedUser = response.user || {};
                const profileUpdateData = {
                    education: updatedUser.education || filteredEducation.map(e => ({
                        ...e,
                        yearOfPassing: e.endYear
                    })),
                    experience: updatedUser.experience || filteredExperience.map(e => ({
                        companyName: e.company,
                        designation: e.role,
                        startDate: e.startDate,
                        endDate: e.endDate,
                        duration: `${e.startDate} - ${e.endDate || 'Present'}`
                    })),
                };

                // If server returned documents, use them; otherwise keep local file names
                if (updatedUser.documents && updatedUser.documents.length > 0) {
                    profileUpdateData.documents = updatedUser.documents;
                } else {
                    profileUpdateData.documents = {
                        ...(typeof user.documents === 'object' && !Array.isArray(user.documents) ? user.documents : {}),
                        kycUrl: kycFile ? kycFile.name : (user.documents?.kycUrl || null),
                        resumeUrl: resumeFile ? resumeFile.name : (user.documents?.resumeUrl || null),
                    };
                }

                updateUser(profileUpdateData);
                setMessage({ type: 'success', text: 'Onboarding details submitted successfully!' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to submit details.' });
            }
        } catch (error) {
            console.error('Onboarding submission error:', error);
            setMessage({ type: 'error', text: 'Failed to submit details. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout menuItems={menuItems} title="Onboarding">
            <div className="container-responsive">
                <div className="card-responsive" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Complete Your Profile</h2>

                    {/* Section Tabs */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
                        {['education', 'experience', 'documents'].map((section) => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                style={{
                                    padding: '12px 20px',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeSection === section ? '2px solid #667eea' : 'none',
                                    color: activeSection === section ? '#667eea' : '#64748b',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {section}
                            </button>
                        ))}
                    </div>

                    {message.text && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                            color: message.type === 'success' ? '#166534' : '#991b1b',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            {message.text}
                        </div>
                    )}

                    {/* Education Section */}
                    {activeSection === 'education' && (
                        <div>
                            {education.map((edu, index) => (
                                <div key={index} style={{ marginBottom: '20px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ margin: 0, color: '#1e293b' }}>Education #{index + 1}</h4>
                                        {education.length > 1 && (
                                            <button onClick={() => removeEducation(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                                        )}
                                    </div>
                                    <div className="grid-2-col" style={{ gap: '16px' }}>
                                        <input
                                            type="text"
                                            name="institution"
                                            placeholder="Institution Name"
                                            value={edu.institution}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="text"
                                            name="degree"
                                            placeholder="Degree"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="text"
                                            name="field"
                                            placeholder="Field of Study (e.g. Computer Science)"
                                            value={edu.field}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="number"
                                            name="startYear"
                                            placeholder="Start Year"
                                            value={edu.startYear}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="number"
                                            name="endYear"
                                            placeholder="End Year"
                                            value={edu.endYear}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEducation} style={secondaryButtonStyle}>+ Add More Education</button>
                        </div>
                    )}

                    {/* Experience Section */}
                    {activeSection === 'experience' && (
                        <div>
                            {experience.map((exp, index) => (
                                <div key={index} style={{ marginBottom: '20px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ margin: 0, color: '#1e293b' }}>Experience #{index + 1}</h4>
                                        {experience.length > 1 && (
                                            <button onClick={() => removeExperience(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                                        )}
                                    </div>
                                    <div className="grid-2-col" style={{ gap: '16px' }}>
                                        <input
                                            type="text"
                                            name="company"
                                            placeholder="Company Name"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="text"
                                            name="role"
                                            placeholder="Role / Designation"
                                            value={exp.role}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="date"
                                            name="startDate"
                                            placeholder="Start Date"
                                            value={exp.startDate}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="date"
                                            name="endDate"
                                            placeholder="End Date"
                                            value={exp.endDate}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addExperience} style={secondaryButtonStyle}>+ Add More Experience</button>
                        </div>
                    )}

                    {/* Documents Section */}
                    {activeSection === 'documents' && (
                        <>
                            <div className="grid-2-col" style={{ gap: '24px' }}>
                                {/* KYC Section */}
                                <div style={docBoxStyle(kycFile)}>
                                    <div style={iconCircleStyle(kycFile)}>
                                        <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none">
                                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 21.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>KYC Documents</h4>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                                        {kycFile ? `Selected: ${kycFile.name}` : 'Upload Aadhar, PAN, or Passport (PDF only)'}
                                    </p>
                                    <input type="file" ref={kycInputRef} onChange={handleKycChange} style={{ display: 'none' }} accept=".pdf" />
                                    <button onClick={handleKycClick} style={smallButtonStyle(kycFile)}>
                                        {kycFile ? 'Change File' : 'Choose KYC'}
                                    </button>
                                </div>

                                {/* Resume Section */}
                                <div style={docBoxStyle(resumeFile)}>
                                    <div style={iconCircleStyle(resumeFile)}>
                                        <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none">
                                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Professional Resume</h4>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                                        {resumeFile ? `Selected: ${resumeFile.name}` : 'Upload your latest CV (PDF only)'}
                                    </p>
                                    <input type="file" ref={resumeInputRef} onChange={handleResumeChange} style={{ display: 'none' }} accept=".pdf" />
                                    <button onClick={handleResumeClick} style={smallButtonStyle(resumeFile)}>
                                        {resumeFile ? 'Change File' : 'Choose Resume'}
                                    </button>
                                </div>
                            </div>

                            {/* Extra Documents */}
                            {extraDocs.length > 0 && (
                                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {extraDocs.map((doc, index) => (
                                        <div key={index} style={{
                                            padding: '20px',
                                            border: `2px dashed ${doc.file ? '#10b981' : '#e2e8f0'}`,
                                            borderRadius: '12px',
                                            background: doc.file ? '#f0fff4' : '#f8fafc',
                                            display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap'
                                        }}>
                                            <div style={{ flex: '1', minWidth: '180px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Document Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Offer Letter, Certificate..."
                                                    value={doc.name}
                                                    onChange={(e) => handleExtraDocName(index, e.target.value)}
                                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                            <div style={{ flex: '1', minWidth: '180px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>PDF File</label>
                                                <label style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '10px 14px', borderRadius: '8px',
                                                    border: `1px solid ${doc.file ? '#10b981' : '#cbd5e1'}`,
                                                    background: doc.file ? '#ecfdf5' : 'white',
                                                    cursor: 'pointer', fontSize: '13px',
                                                    color: doc.file ? '#065f46' : '#64748b', fontWeight: '500'
                                                }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="17 8 12 3 7 8" />
                                                        <line x1="12" y1="3" x2="12" y2="15" />
                                                    </svg>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                                                        {doc.file ? doc.file.name : 'Choose PDF'}
                                                    </span>
                                                    <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && handleExtraDocFile(index, e.target.files[0])} />
                                                </label>
                                            </div>
                                            <button onClick={() => removeExtraDoc(index)} style={{
                                                marginTop: '22px', padding: '10px 12px',
                                                background: '#fee2e2', color: '#dc2626',
                                                border: 'none', borderRadius: '8px',
                                                cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                                                display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add More Document Button */}
                            <button
                                onClick={addExtraDoc}
                                style={{
                                    marginTop: '20px', width: '100%', padding: '14px',
                                    background: 'white', border: '2px dashed #a5b4fc',
                                    borderRadius: '12px', color: '#4f46e5',
                                    fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add More Document
                            </button>
                        </>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            width: '100%',
                            marginTop: '32px',
                            padding: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.8 : 1,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                        }}
                    >
                        {loading ? 'Submitting...' : 'Save & Submit All Information'}
                    </button>

                </div>
            </div>
        </Layout>
    );
};

// Styles
const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px'
};

const secondaryButtonStyle = {
    padding: '10px 20px',
    background: 'white',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    color: '#64748b',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%'
};

const docBoxStyle = (file) => ({
    padding: '24px',
    border: `2px dashed ${file ? '#10b981' : '#e2e8f0'}`,
    borderRadius: '12px',
    textAlign: 'center',
    background: file ? '#f0fff4' : '#ffffff',
    transition: 'all 0.3s ease'
});

const iconCircleStyle = (file) => ({
    width: '56px',
    height: '56px',
    background: file ? '#10b981' : '#f1f5f9',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: file ? 'white' : '#64748b'
});

const smallButtonStyle = (file) => ({
    padding: '8px 20px',
    background: file ? '#10b981' : '#f1f5f9',
    color: file ? 'white' : '#475569',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
});

export default Onboarding;
