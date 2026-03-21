import fs from 'fs';

const BASE_URL = 'http://64.227.146.144:3001/api/v1';

async function run() {
    try {
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: 'EMP-ADMIN1', password: 'YourSecurePassword123!' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login result:', loginRes.status, loginData);
        if (!token) return;

        console.log('\n=== Test Onboarding Submission ===');
        
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        // Create dummy file content
        const fileContent = 'dummy pdf content for testing onboarding API error';
        
        let body = '';
        
        // Education
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="education"\r\n\r\n`;
        body += `[]\r\n`;
        
        // Experience
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="experience"\r\n\r\n`;
        body += `[]\r\n`;
        
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="docNames"\r\n\r\n`;
        body += `Test Document Name\r\n`;

        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="files"; filename="testdoc.pdf"\r\n`;
        body += `Content-Type: application/pdf\r\n\r\n`;
        body += `${fileContent}\r\n`;
        
        body += `--${boundary}--\r\n`;

        const res1 = await fetch(`${BASE_URL}/user/onboarding`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: body
        });
        
        console.log('Status:', res1.status);
        const body1 = await res1.text();
        console.log('Response:', body1);

    } catch (err) {
        console.error('Fatal:', err);
    }
}

run();
