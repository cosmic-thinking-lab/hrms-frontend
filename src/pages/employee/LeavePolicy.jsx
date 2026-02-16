import React from 'react';
import Layout from '../../components/Layout';
import { leavePolicies } from '../../utils/dummyData';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';

const LeavePolicy = () => {
    const menuItems = getEmployeeMenuItems();

    return (
        <Layout menuItems={menuItems} title="Leave Policy">
            <div className="container-responsive">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {leavePolicies.map((policy, index) => (
                        <div key={index} className="card-responsive" style={{ padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                            <div className="flex-responsive" style={{ alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    flexShrink: 0
                                }}>
                                    <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24" fill="none">
                                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{policy.type}</h3>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Allocation</span>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{policy.days} <small style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Days / Year</small></div>
                            </div>

                            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Description</span>
                                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>{policy.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card-responsive" style={{ marginTop: '40px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>General Guidelines</h3>
                    <ul style={{ display: 'grid', gap: '12px', color: '#64748b', fontSize: '14px', paddingLeft: '20px' }}>
                        <li>Leave requests should be submitted at least 48 hours in advance for approval.</li>
                        <li>Unused casual leaves do not carry forward to the next calendar year.</li>
                        <li>Sick leaves require a medical certificate if extending beyond 3 consecutive days.</li>
                        <li>Loss of pay (LWP) will be implemented if no leave balance is available.</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default LeavePolicy;
