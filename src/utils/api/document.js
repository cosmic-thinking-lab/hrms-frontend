import { BASE_URL } from './base';

export const documentAPI = {
    // User endpoint: PATCH /user/documents/:docId
    update: async (token, docId, file, name) => {
        const formData = new FormData();
        formData.append('document', file, name);
        const response = await fetch(`${BASE_URL}/user/documents/${docId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        return response.json();
    },

    // User endpoint: DELETE /user/documents/:docId
    remove: async (token, docId) => {
        const response = await fetch(`${BASE_URL}/user/documents/${docId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },
};

