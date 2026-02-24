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

    const handleDownload = async (slip) => {
        if (slip.fileUrl || slip.url) {
            const url = slip.fileUrl || slip.url;
            const filename = `SalarySlip_${monthNames[slip.month - 1]}_${slip.year}.pdf`;
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
            return;
        }

        const element = document.getElementById(`slip-${slip._id}`);
        if (!element) return;

        setDownloadingId(slip._id);
        try {
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: 1200,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.getElementById(`slip-${slip._id}`);
                    if (clonedElement) {
                        clonedElement.style.width = '800px';
                        clonedElement.style.padding = '40px';
                        const btnContainer = clonedElement.querySelector('.slip-actions');
                        if (btnContainer) btnContainer.style.display = 'none';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const margin = 10;
            const imgWidth = pdfWidth - (2 * margin);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

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
                                <div className="flex-responsive" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            background: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#64748b'
                                        }}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>
                                                {monthNames[slip.month - 1]} {slip.year}
                                            </h3>
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                                Uploaded on {new Date(slip.uploadedAt || slip.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        {slip.details?.netSalary && (
                                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>
                                                ₹{slip.details.netSalary.toLocaleString()}
                                            </div>
                                        )}

                                        <div className="slip-actions" style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleView(slip.fileUrl || slip.url)}
                                                disabled={downloadingId === slip._id}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#eef2ff',
                                                    color: '#4f46e5',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    cursor: downloadingId === slip._id ? 'not-allowed' : 'pointer',
                                                    border: 'none',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDownload(slip)}
                                                disabled={downloadingId === slip._id}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: downloadingId === slip._id ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    cursor: downloadingId === slip._id ? 'not-allowed' : 'pointer',
                                                    border: 'none',
                                                    transition: 'all 0.2s',
                                                    boxShadow: downloadingId === slip._id ? 'none' : '0 4px 10px rgba(118, 75, 162, 0.2)'
                                                }}
                                            >
                                                {downloadingId === slip._id ? (
                                                    <>
                                                        <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', borderLeftColor: '#fff' }}></div>
                                                        ...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                                        Download
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
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
