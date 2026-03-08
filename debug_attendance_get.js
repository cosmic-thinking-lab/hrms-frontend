const BASE_URL = process.env.VITE_API_BASE_URL || 'https://apis-hrms.duckdns.org/api/v1';

async function run() {
    try {
        // Login
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: 'EMP-ADMIN1', password: 'YourSecurePassword123!' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        if (!token) throw new Error('Login failed');
        console.log('Login OK.');

        const empId = 'EMP-G2UU6S';

        // Functional endpoint for attendance
        const ep = `/user/${empId}/attendance`;

        try {
            const res = await fetch(`${BASE_URL}${ep}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const status = res.status;
            const isOk = res.ok;
            let body = '';
            if (isOk) {
                body = await res.text();
            }
            console.log(`GET ${ep} => ${status} ${isOk ? '✅' : '❌'}`);
            if (isOk) {
                console.log('Response:', JSON.stringify(JSON.parse(body), null, 2));
            }
        } catch (e) {
            console.log(`GET ${ep} => Error: ${e.message}`);
        }
    } catch (err) {
        console.error('Fatal:', err);
    }
}

run();
