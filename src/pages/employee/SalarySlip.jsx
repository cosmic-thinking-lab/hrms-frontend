import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Layout from '../../components/Layout';
import { monthNames } from '../../utils/dummyData';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';
import { payrollAPI } from '../../utils/api';

const SalarySlip = () => {
    const { token, user } = useAuth();
    const [userSlips, setUserSlips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const menuItems = getEmployeeMenuItems();

    useEffect(() => {
        const fetchSlips = async () => {
            try {
                const data = await payrollAPI.getBySelf(token, user.employeeId);
                let slips = [];
                if (data && Array.isArray(data)) {
                    slips = data;
                } else if (data && data.success !== false && data.data && Array.isArray(data.data)) {
                    slips = data.data;
                } else if (data && data.salarySlips && Array.isArray(data.salarySlips)) {
                    slips = data.salarySlips;
                }
                setUserSlips(slips);
            } catch (error) {
                console.error('Error fetching slips:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token && user?.employeeId) {
            fetchSlips();
        }
    }, [token, user]);

    const handleDownload = async (slip) => {
        if (slip.fileUrl || slip.url) {
            window.open(slip.fileUrl || slip.url, '_blank');
            return;
        }

        const element = document.getElementById(`slip-${slip._id}`);
        if (!element) return;

        setDownloadingId(slip._id);
        try {
            const canvas = await html2canvas(element, {
                scale: 3, // Higher resolution
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: 1200, // Ensure a consistent viewport width for capture
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.getElementById(`slip-${slip._id}`);
                    if (clonedElement) {
                        clonedElement.style.width = '800px'; // Fixed width for better PDF layout
                        clonedElement.style.padding = '40px';
                        const btn = clonedElement.querySelector('.download-btn-container');
                        if (btn) btn.style.display = 'none';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png');

            // Standard A4 dimensions in mm
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const margin = 10; // 10mm margin
            const imgWidth = pdfWidth - (2 * margin);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add image with top margin
            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

            pdf.save(`SalarySlip_${monthNames[slip.month - 1]}_${slip.year}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <Layout menuItems={menuItems} title="Salary Slips">
            <div className="container-responsive">
                <div style={{ display: 'grid', gap: '20px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <div className="spinner" style={{ margin: '0 auto 16px', width: '40px', height: '40px' }}></div>
                            <p style={{ color: '#64748b' }}>Loading your salary slips...</p>
                        </div>
                    ) : userSlips.length > 0 ? (
                        userSlips.map((slip) => (
                            <div
                                key={slip._id}
                                id={`slip-${slip._id}`}
                                className="card-responsive"
                                style={{
                                    border: '1px solid #e2e8f0',
                                    transition: 'transform 0.2s',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div className="flex-responsive" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: slip.details ? '24px' : '0' }}>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
                                            {monthNames[slip.month - 1]} {slip.year}
                                        </h3>
                                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                                            Uploaded on {new Date(slip.uploadedAt || slip.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {slip.details?.netSalary && (
                                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>
                                            ₹{slip.details.netSalary.toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                {slip.details ? (
                                    <div className="grid-2-col" style={{ gap: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Earnings</h4>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                {slip.details.basicSalary && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                        <span>Basic Salary</span>
                                                        <span style={{ fontWeight: '600' }}>₹{slip.details.basicSalary.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {slip.details.hra && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                        <span>HRA</span>
                                                        <span style={{ fontWeight: '600' }}>₹{slip.details.hra.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {slip.details.allowances && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                        <span>Allowances</span>
                                                        <span style={{ fontWeight: '600' }}>₹{slip.details.allowances.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Deductions</h4>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                {slip.details.deductions && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                        <span>Standard Deductions</span>
                                                        <span style={{ fontWeight: '600', color: '#ef4444' }}>-₹{slip.details.deductions.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        marginTop: '20px',
                                        padding: '40px 20px',
                                        background: '#f1f5f9',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: '#e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#64748b'
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                            </svg>
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', color: '#475569' }}>Salary Slip Available</p>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Detailed breakdown is available in the PDF file.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="download-btn-container" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => handleDownload(slip)}
                                        disabled={downloadingId === slip._id}
                                        style={{
                                            padding: '12px 24px',
                                            background: downloadingId === slip._id ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: downloadingId === slip._id ? 'not-allowed' : 'pointer',
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(118, 75, 162, 0.2)'
                                        }}
                                    >
                                        {downloadingId === slip._id ? (
                                            <>
                                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderLeftColor: '#fff' }}></div>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px' }}>
                                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {slip.fileUrl || slip.url ? 'View/Download PDF' : 'Generate & Download PDF'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card-responsive" style={{ textAlign: 'center', padding: '100px 20px', color: '#64748b' }}>
                            <div style={{ marginBottom: '20px', opacity: 0.5, display: 'flex', justifyContent: 'center' }}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V9C20 8.46957 19.7893 7.96086 19.4142 7.58579C19.0391 7.21071 18.5304 7 18 7H15M9 7V5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5V7M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>No Salary Slips Found</h3>
                            <p>You don't have any salary slips generated yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SalarySlip;
