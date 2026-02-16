import React, { useState, useRef } from 'react';
import Layout from '../../components/Layout';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';

const Onboarding = () => {
    const menuItems = getEmployeeMenuItems();
    const [kycFile, setKycFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState('');

    const kycInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    const handleKycClick = () => kycInputRef.current.click();
    const handleResumeClick = () => resumeInputRef.current.click();

    const handleKycChange = (e) => {
        if (e.target.files[0]) {
            setKycFile(e.target.files[0]);
            setStatus('');
        }
    };

    const handleResumeChange = (e) => {
        if (e.target.files[0]) {
            setResumeFile(e.target.files[0]);
            setStatus('');
        }
    };

    const handleUpload = () => {
        if (!kycFile || !resumeFile) {
            setStatus('Please select both KYC and Resume documents.');
            return;
        }

        setUploading(true);
        setStatus('Uploading documents...');

        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            setStatus('Documents uploaded successfully! 🚀');
            setKycFile(null);
            setResumeFile(null);
        }, 2000);
    };

    return (
        <Layout menuItems={menuItems} title="Onboarding">
            <div className="container-responsive">
                <div className="card-responsive" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Onboarding Documents</h2>
                    <p style={{ color: '#64748b', marginBottom: '32px' }}>Please upload your identity proof and professional details to finalize your membership.</p>

                    <div className="grid-2-col" style={{ gap: '24px' }}>
                        {/* KYC Section */}
                        <div style={{
                            padding: '32px',
                            border: `2px dashed ${kycFile ? '#10b981' : '#e2e8f0'}`,
                            borderRadius: '16px',
                            textAlign: 'center',
                            background: kycFile ? '#f0fff4' : 'transparent',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: kycFile ? '#10b981' : '#e2e8f0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                color: kycFile ? 'white' : '#64748b'
                            }}>
                                <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 21.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>KYC Documents</h4>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                                {kycFile ? `Selected: ${kycFile.name}` : 'Upload Aadhar, PAN, or Passport copy'}
                            </p>
                            <input
                                type="file"
                                ref={kycInputRef}
                                onChange={handleKycChange}
                                style={{ display: 'none' }}
                                accept=".pdf,.png,.jpg,.jpeg"
                            />
                            <button
                                onClick={handleKycClick}
                                style={{
                                    padding: '12px 28px',
                                    background: kycFile ? '#10b981' : '#64748b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                {kycFile ? 'Change File' : 'Choose KYC'}
                            </button>
                        </div>

                        {/* Resume Section */}
                        <div style={{
                            padding: '32px',
                            border: `2px dashed ${resumeFile ? '#10b981' : '#e2e8f0'}`,
                            borderRadius: '16px',
                            textAlign: 'center',
                            background: resumeFile ? '#f0fff4' : 'transparent',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: resumeFile ? '#10b981' : '#e2e8f0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                color: resumeFile ? 'white' : '#64748b'
                            }}>
                                <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none">
                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Professional Resume</h4>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                                {resumeFile ? `Selected: ${resumeFile.name}` : 'Upload your latest CV or Portfolio'}
                            </p>
                            <input
                                type="file"
                                ref={resumeInputRef}
                                onChange={handleResumeChange}
                                style={{ display: 'none' }}
                                accept=".pdf,.doc,.docx"
                            />
                            <button
                                onClick={handleResumeClick}
                                style={{
                                    padding: '12px 28px',
                                    background: resumeFile ? '#10b981' : '#64748b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                {resumeFile ? 'Change File' : 'Choose Resume'}
                            </button>
                        </div>
                    </div>

                    {status && (
                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            borderRadius: '12px',
                            background: status.includes('successfully') ? '#ecfdf5' : '#fff7ed',
                            color: status.includes('successfully') ? '#059669' : '#d97706',
                            fontSize: '14px',
                            fontWeight: '500',
                            textAlign: 'center',
                            border: `1px solid ${status.includes('successfully') ? '#10b981' : '#fbbf24'}`
                        }}>
                            {status}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        style={{
                            width: '100%',
                            marginTop: '32px',
                            padding: '16px',
                            background: (kycFile && resumeFile) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
                            color: (kycFile && resumeFile) ? 'white' : '#94a3b8',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: (kycFile && resumeFile && !uploading) ? 'pointer' : 'not-allowed',
                            boxShadow: (kycFile && resumeFile) ? '0 10px 20px rgba(118, 75, 162, 0.2)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {uploading ? 'Processing...' : 'Upload All Documents'}
                    </button>

                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                            Max file size: 5MB per document. Supported formats: .pdf, .jpg, .png, .docx
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Onboarding;
