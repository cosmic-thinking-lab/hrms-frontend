import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { holidays as initialHolidays } from '../../utils/dummyData';
import { getAdminMenuItems } from '../../utils/menuConfig.jsx';

const ManageHolidays = () => {
    const [holidayList, setHolidayList] = useState(() => {
        const saved = localStorage.getItem('hrms_holidays');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing saved holidays', e);
            }
        }
        return initialHolidays.map(h => ({ ...h, isDisabled: false }));
    });

    const menuItems = getAdminMenuItems();

    useEffect(() => {
        localStorage.setItem('hrms_holidays', JSON.stringify(holidayList));
    }, [holidayList]);

    const handleDisable = (index) => {
        setHolidayList(prev => prev.map((h, i) =>
            i === index ? { ...h, isDisabled: !h.isDisabled } : h
        ));
    };

    return (
        <Layout menuItems={menuItems} title="Manage Holidays">
            <div className="container-responsive">
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="view-button" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '14px 28px' }}>
                        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" /></svg>
                        Add Holiday
                    </button>
                </div>

                <div className="card-responsive">
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {holidayList.map((holiday, index) => (
                            <div key={index} className="flex-responsive" style={{
                                padding: '20px',
                                background: holiday.isDisabled ? '#f1f5f9' : '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                filter: holiday.isDisabled ? 'grayscale(1)' : 'none',
                                opacity: holiday.isDisabled ? 0.7 : 1,
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: holiday.isDisabled ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    flexShrink: 0
                                }}>
                                    <span style={{ fontSize: '24px', fontWeight: '700', lineHeight: 1 }}>{new Date(holiday.date).getDate()}</span>
                                    <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>{new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: holiday.isDisabled ? '#64748b' : '#1e293b', margin: '0 0 6px 0' }}>{holiday.name}</h4>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>{new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        background: holiday.isDisabled ? '#e2e8f0' : (holiday.type === 'National' ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'),
                                        color: holiday.isDisabled ? '#94a3b8' : (holiday.type === 'National' ? '#2563eb' : '#d97706'),
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {holiday.type}
                                    </span>
                                    <button
                                        onClick={() => handleDisable(index)}
                                        style={{
                                            padding: '8px 16px',
                                            background: holiday.isDisabled ? '#cbd5e1' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: holiday.isDisabled ? '#475569' : '#64748b',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {holiday.isDisabled ? 'Enable' : 'Disable'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ManageHolidays;
