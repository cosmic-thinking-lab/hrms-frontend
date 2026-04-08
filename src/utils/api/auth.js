import { BASE_URL } from './base';

export const authAPI = {
    // Auth endpoint (public): POST /auth/login
    login: async (employeeId, password) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId, password }),
        });
        return response.json();
    },

    // User endpoint (authenticated): PATCH /user/first-login-reset
    setPassword: async (token, newPassword) => {
        const response = await fetch(`${BASE_URL}/user/first-login-reset`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ newPassword }),
        });
        return response.json();
    },
};
