import React from 'react';
import Layout from '../../components/Layout';
import { getAdminMenuItems } from '../../utils/menuConfig.jsx';

const ManagePolicies = () => {
    const menuItems = getAdminMenuItems();

    return (
        <Layout menuItems={menuItems} title="Manage Policies">
            <div className="container-responsive">
                <div className="card-responsive">
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Leave Policy Editor</h3>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Policy Title</label>
                        <input
                            type="text"
                            defaultValue="Leave Policy - 2026"
                            style={{ width: '100%', padding: '14px 20px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Policy Content</label>
                        <textarea
                            rows="15"
                            defaultValue="# Leave Policy - 2026\n\n## Types of Leave\n\n### 1. Casual Leave (CL)\n- Entitlement: 12 days per year\n- Carry Forward: Maximum 6 days to next year\n\n### 2. Sick Leave (SL)\n- Entitlement: 12 days per year\n- Medical Certificate: Required for more than 3 consecutive days"
                            style={{ width: '100%', padding: '14px 20px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'monospace', resize: 'vertical' }}
                        />
                    </div>

                    <div className="flex-responsive" style={{ gap: '12px', alignItems: 'stretch' }}>
                        <button style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                            Save Changes
                        </button>
                        <button style={{ padding: '14px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>
                            Preview
                        </button>
                    </div>

                    <div style={{ marginTop: '24px', padding: '16px 20px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                            <strong>Note:</strong> Changes will be visible to all employees immediately after saving.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ManagePolicies;
