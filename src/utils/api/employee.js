import { BASE_URL } from './base';

export const employeeAPI = {
    // Admin endpoint: GET /admin/employees (supports list + search/filter)
    getAll: async (token, search = '', role = '', page = 1, limit = 10) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);

        const response = await fetch(`${BASE_URL}/admin/employees?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },

    // User/Admin token endpoint: GET /user/:employeeId/profile
    getProfile: async (token, employeeId) => {
        const response = await fetch(`${BASE_URL}/user/${employeeId}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },

    // Admin endpoint: POST /admin/employees
    create: async (token, data) => {
        const response = await fetch(`${BASE_URL}/admin/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Admin endpoint: PATCH /admin/employees/:employeeId
    update: async (token, employeeId, data) => {
        const response = await fetch(`${BASE_URL}/admin/employees/${employeeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Admin endpoint: DELETE /admin/employees/:employeeId
    delete: async (token, employeeId) => {
        const response = await fetch(`${BASE_URL}/admin/employees/${employeeId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response;
    },
};
