
async function run() {
    try {
        const BASE_URL = process.env.VITE_API_BASE_URL || 'https://apis-hrms.duckdns.org/api/v1';
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: 'EMP-ADMIN1', password: 'YourSecurePassword123!' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        if (!token) return;

        console.log('\n=== Test Onboarding Submission with explicit documents array (JSON) ===');
        
        const payload = {
            education: [],
            experience: [],
            documents: [
                { name: 'Migration Test', url: 'https://test.com/test.pdf' }
            ]
        };

        const res = await fetch(`${BASE_URL}/user/onboarding`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (err) {
        console.error('Fatal Error:', err);
    }
}

run();
