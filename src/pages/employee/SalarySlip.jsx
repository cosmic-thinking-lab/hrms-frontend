import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Layout from '../../components/Layout';
import { salarySlips, monthNames } from '../../utils/dummyData';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';

const SalarySlip = () => {
    const { user } = useAuth();
    const [downloadingId, setDownloadingId] = useState(null);
    const userSlips = salarySlips.filter(s => s.employeeId === user.employeeId);
    const menuItems = getEmployeeMenuItems();

    const handleDownload = async (slip) => {
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
                    {userSlips.length > 0 ? (
                        userSlips.map((slip) => (
                            <div
                                key={slip._id}
                                id={`slip-${slip._id}`}
                                className="card-responsive"
                            >
                                <div className="flex-responsive" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
                                            {monthNames[slip.month - 1]} {slip.year}
                                        </h3>
                                        <span style={{ fontSize: '14px', color: '#64748b' }}>Generated on {new Date(slip.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>
                                        ₹{slip.details.netSalary.toLocaleString()}
                                    </div>
                                </div>

                                <div className="grid-2-col" style={{ gap: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Earnings</h4>
                                        <div style={{ display: 'grid', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span>Basic Salary</span>
                                                <span style={{ fontWeight: '600' }}>₹{slip.details.basicSalary.toLocaleString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span>HRA</span>
                                                <span style={{ fontWeight: '600' }}>₹{slip.details.hra.toLocaleString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span>Allowances</span>
                                                <span style={{ fontWeight: '600' }}>₹{slip.details.allowances.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Deductions</h4>
                                        <div style={{ display: 'grid', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span>Standard Deductions</span>
                                                <span style={{ fontWeight: '600', color: '#ef4444' }}>-₹{slip.details.deductions.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                            border: 'none'
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
                                                Download PDF
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
