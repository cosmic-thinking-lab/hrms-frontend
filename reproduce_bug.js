
async function run() {
    try {
        const BASE_URL = 'http://64.227.146.144:3001/api/v1';
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: 'EMP-ADMIN1', password: 'YourSecurePassword123!' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login result:', loginRes.status);
        if (!token) return;

        console.log('\n=== Test Onboarding Submission with 2 New Files ===');
        
        const fd = new FormData();
        fd.append('education', JSON.stringify([]));
        fd.append('experience', JSON.stringify([]));
        
        // Add doc 1
        fd.append('docNames', 'Reproduction Doc 1');
        const blob1 = new Blob(['dummy content 1'], { type: 'application/pdf' });
        fd.append('files', blob1, 'reproduction_doc1.pdf');
        
        // Add doc 2
        fd.append('docNames', 'Reproduction Doc 2');
        const blob2 = new Blob(['dummy content 2'], { type: 'application/pdf' });
        fd.append('files', blob2, 'reproduction_doc2.pdf');

        const res = await fetch(`${BASE_URL}/user/onboarding`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            body: fd
        });
        
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (err) {
        console.error('Fatal Error:', err);
    }
}

run();
