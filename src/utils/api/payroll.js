import { BASE_URL } from './base';

export const payrollAPI = {
    // Admin endpoint: POST /admin/payroll/upload
    // Accepts either FormData directly or a plain object payload.
    upload: async (token, payload) => {
        const formData = payload instanceof FormData ? payload : new FormData();

        if (!(payload instanceof FormData) && payload) {
            if (payload.file) formData.append('file', payload.file);
            if (payload.employeeId) formData.append('employeeId', payload.employeeId);
            if (payload.month) formData.append('month', String(payload.month));
            if (payload.year) formData.append('year', String(payload.year));
        }

        const response = await fetch(`${BASE_URL}/admin/payroll/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        return response.json();
    },

    // User/Admin endpoint: GET /user/:employeeId/salary-slips
    getByEmployeeId: async (token, employeeId) => {
        const response = await fetch(`${BASE_URL}/user/${employeeId}/salary-slips`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },

    // Backward-compatible alias for existing user screens
    getBySelf: async (token, employeeId) => {
        return payrollAPI.getByEmployeeId(token, employeeId);
    },
};

