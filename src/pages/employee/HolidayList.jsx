import React from 'react';
import Layout from '../../components/Layout';
import { holidays } from '../../utils/dummyData';
import { getEmployeeMenuItems } from '../../utils/menuConfig.jsx';

const HolidayList = () => {
    const menuItems = getEmployeeMenuItems();
    const currentYear = new Date().getFullYear();

    return (
        <Layout menuItems={menuItems} title="Holiday Calendar">
            <div className="container-responsive">
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '24px 32px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Company Holidays {currentYear}</h3>
                    </div>
                    <div style={{ padding: '0 32px' }}>
                        {holidays.map((holiday, index) => (
                            <div key={index} className="flex-responsive" style={{
                                alignItems: 'center',
                                gap: '24px',
                                padding: '20px 0',
                                borderBottom: index === holidays.length - 1 ? 'none' : '1px solid #f1f5f9'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: holiday.type === 'NATIONAL' ? '#eff6ff' : '#fef2f2',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: holiday.type === 'NATIONAL' ? '#3b82f6' : '#ef4444', textTransform: 'uppercase' }}>
                                        {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                    <span style={{ fontSize: '20px', fontWeight: '800', color: holiday.type === 'NATIONAL' ? '#1e40af' : '#991b1b' }}>
                                        {new Date(holiday.date).getDate()}
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>{holiday.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '13px', color: '#64748b' }}>{new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></span>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            padding: '2px 8px',
                                            borderRadius: '20px',
                                            background: holiday.type === 'NATIONAL' ? '#dbeafe' : '#fee2e2',
                                            color: holiday.type === 'NATIONAL' ? '#1e40af' : '#b91c1c'
                                        }}>
                                            {holiday.type}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
                                    Upcoming
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HolidayList;
