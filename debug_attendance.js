const BASE_URL = 'http://64.227.146.144:3001/api/v1';

async function run() {
    try {
        // Step 1: Login
        console.log('=== Step 1: Logging in ===');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: 'EMP-ADMIN1', password: 'YourSecurePassword123!' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        if (!token) throw new Error('Login failed: ' + JSON.stringify(loginData));
        console.log('Login OK. Token received.');

        const testEmployeeId = 'EMP-G2UU6S'; // from the screenshot

        // Step 2: Fetch current attendance
        console.log('\n=== Step 2: Fetching current attendance ===');
        const getRes1 = await fetch(`${BASE_URL}/admin/attendance/employee/${testEmployeeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('GET Status:', getRes1.status);
        const getData1 = await getRes1.text();
        console.log('GET Response:', getData1.substring(0, 500));

        // Step 3: Try marking attendance with POST
        console.log('\n=== Step 3: Marking attendance (POST /admin/attendance/mark) ===');
        const markPayload = {
            employeeId: testEmployeeId,
            date: '2026-02-18',
            status: 'PRESENT',
            remarks: 'Debug test',
            remark: 'Debug test'
        };
        console.log('Payload:', JSON.stringify(markPayload));

        const markRes = await fetch(`${BASE_URL}/admin/attendance/mark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(markPayload)
        });
        console.log('POST Status:', markRes.status);
        const markData = await markRes.text();
        console.log('POST Response:', markData.substring(0, 500));

        // Step 4: Verify by fetching again
        console.log('\n=== Step 4: Verifying persistence ===');
        const getRes2 = await fetch(`${BASE_URL}/user/${testEmployeeId}/attendance`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('GET Status:', getRes2.status);
        const getData2 = await getRes2.text();
        console.log('GET Response:', getData2.substring(0, 500));

    } catch (err) {
        console.error('Fatal Error:', err);
    }
}

run();
