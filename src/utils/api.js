export const BASE_URL = process.env.VITE_API_BASE_URL || 'https://apis-hrms.duckdns.org/api/v1';

const getToken = () => localStorage.getItem('hrms_token');

export const authAPI = {
    setPassword: async (token, newPassword) => {
        const response = await fetch(`${BASE_URL}/user/first-login-reset`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ newPassword: newPassword })
        });
        return response.json();
    }
};

export const employeeAPI = {
    getAll: async (token, search = '', role = '', page = 1, limit = 10) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        params.append('page', page);
        params.append('limit', limit);
        const response = await fetch(`${BASE_URL}/admin/employees?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    getProfile: async (token) => {
        // Try /employees/me for self-profile
        const response = await fetch(`${BASE_URL}/employees/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    create: async (token, data) => {
        const response = await fetch(`${BASE_URL}/admin/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    update: async (token, id, data) => {
        const response = await fetch(`${BASE_URL}/admin/employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    delete: async (token, id) => {
        const response = await fetch(`${BASE_URL}/admin/employees/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response;
    }
};

export const onboardingAPI = {
    submit: async (token, data) => {
        const response = await fetch(`${BASE_URL}/user/onboarding`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    submitWithFiles: async (token, { education = [], experience = [], extraFiles = [] }) => {
        const formData = new FormData();
        formData.append('education', JSON.stringify(education));
        formData.append('experience', JSON.stringify(experience));

        if (extraFiles && extraFiles.length > 0) {
            extraFiles.forEach((doc) => {
                if (doc.file) {
                    formData.append('docNames[]', doc.name || 'Unnamed Document');
                    formData.append('files', doc.file);
                }
            });
        }

        const response = await fetch(`${BASE_URL}/user/onboarding`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return response.json();
    }
};

export const documentAPI = {
    upload: async (token, docs) => {
        const formData = new FormData();
        docs.forEach((doc) => {
            formData.append('docNames', doc.name);
            formData.append('files', doc.file);
        });
        const response = await fetch(`${BASE_URL}/user/onboarding`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return response.json();
    },

    update: async (token, docId, file, name) => {
        const formData = new FormData();
        formData.append('document', file, name);
        const response = await fetch(`${BASE_URL}/user/documents/${docId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return response.json();
    },

    remove: async (token, docId) => {
        const response = await fetch(`${BASE_URL}/user/documents/${docId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};

export const payrollAPI = {
    getBySelf: async (token, employeeId) => {
        const response = await fetch(`${BASE_URL}/payroll/${employeeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};

export const attendanceAPI = {
    getByUser: async (token, employeeId) => {
        const response = await fetch(`${BASE_URL}/attendance/${employeeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};
