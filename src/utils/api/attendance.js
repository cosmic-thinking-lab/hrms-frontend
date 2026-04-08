import { BASE_URL } from './base';

// Admin-only attendance endpoints
// --------------------------------

export const attendanceAPI = {
    // Admin endpoint: POST /admin/attendance/mark
    mark: async (token, { employeeId, date, status, remarks }) => {
        const response = await fetch(`${BASE_URL}/admin/attendance/mark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ employeeId, date, status, remarks }),
        });
        return response.json();
    },

    // User/Admin endpoint: GET /user/:employeeId/attendance
    // Supports from, to, page, limit as query params
    getByUser: async (token, employeeId, { from, to, page = 1, limit = 30 } = {}) => {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);

        const qs = params.toString();
        const url = qs
            ? `${BASE_URL}/user/${employeeId}/attendance?${qs}`
            : `${BASE_URL}/user/${employeeId}/attendance`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.json();
    },
};

