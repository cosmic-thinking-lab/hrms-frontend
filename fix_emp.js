const BASE_URL = process.env.VITE_API_BASE_URL || 'https://apis-hrms.duckdns.org/api/v1';

async function run() {
    try {
        console.log('Logging in as Admin...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: 'EMP-ADMIN1', password: 'YourSecurePassword123!' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        if (!token) return console.log('Login failed', loginData);

        const mongoId = '699eb4886a4659f4c2a8512f'; // EMP-WO6XYW
        console.log(`Fixing corrupted documents for EMP-WO6XYW (${mongoId})...`);
        
        const res = await fetch(`${BASE_URL}/admin/employees/${mongoId}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ documents: [] })
        });
        
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Result:', data.message || 'Updated successfully');

    } catch (err) {
        console.error('Fatal:', err);
    }
}

run();
