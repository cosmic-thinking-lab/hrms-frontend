const BASE_URL = 'http://64.227.146.144:3001/api/v1';

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

        const empId = 'EMP-73WZ5X';

        // Try various GET endpoints for attendance
        const endpoints = [
            `/admin/attendance/employee/${empId}`,
            `/admin/attendance/${empId}`,
            `/admin/attendance?employeeId=${empId}`,
            `/admin/attendances/${empId}`,
            `/admin/attendances?employeeId=${empId}`,
            `/attendance/employee/${empId}`,
            `/attendance/${empId}`,
            `/attendance?employeeId=${empId}`,
            `/user/${empId}/attendance`,
            `/user/attendance/${empId}`,
            `/admin/employees/${empId}/attendance`,
            `/admin/employee/${empId}/attendance`,
        ];

        for (const ep of endpoints) {
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
                console.log(`GET ${ep} => ${status} ${isOk ? '✅' : '❌'} ${isOk ? body.substring(0, 200) : ''}`);
            } catch (e) {
                console.log(`GET ${ep} => Error: ${e.message}`);
            }
        }
    } catch (err) {
        console.error('Fatal:', err);
    }
}

run();
