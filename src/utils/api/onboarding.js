import { BASE_URL } from './base';

export const onboardingAPI = {
    // User endpoint: POST /user/onboarding (JSON payload, no files)
    submit: async (token, data) => {
        const response = await fetch(`${BASE_URL}/user/onboarding`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // User endpoint: POST /user/onboarding (multipart payload, with files)
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
            body: formData,
        });
        return response.json();
    },
};

