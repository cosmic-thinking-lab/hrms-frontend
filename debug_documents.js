const BASE_URL = process.env.VITE_API_BASE_URL || 'https://apis-hrms.duckdns.org/api/v1';

async function run() {
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: 'EMP-ADMIN1', password: 'YourSecurePassword123!' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login OK.');

        const mongoId = '699575a1fe23ee7425aa9f19';
        const empId = 'EMP-5GAJVK';
        const ep = `${BASE_URL}/admin/employees/${mongoId}`;

        // Test 1: See the 400 error message
        console.log('\n=== Test 1: Just documents ===');
        const res1 = await fetch(ep, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ documents: [{ name: 'KYC', url: 'test.pdf' }] })
        });
        console.log('Status:', res1.status);
        const body1 = await res1.text();
        console.log('Response:', body1);

        // Test 2: With personalInfo wrapper
        console.log('\n=== Test 2: With personalInfo ===');
        const res2 = await fetch(ep, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                personalInfo: { fullName: 'final testt', email: 'finaltest2342423@gmail.com', phone: '7654217441' },
                documents: [{ name: 'KYC', url: 'test.pdf' }]
            })
        });
        console.log('Status:', res2.status);
        const body2 = await res2.text();
        console.log('Response:', body2.substring(0, 500));

        // Test 3: Minimal required fields
        console.log('\n=== Test 3: Just fullName ===');
        const res3 = await fetch(ep, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ fullName: 'final testt' })
        });
        console.log('Status:', res3.status);
        const body3 = await res3.text();
        console.log('Response:', body3.substring(0, 500));

        // Test 4: personalInfo only
        console.log('\n=== Test 4: personalInfo only ===');
        const res4 = await fetch(ep, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                personalInfo: { fullName: 'final testt', email: 'finaltest2342423@gmail.com', phone: '7654217441' }
            })
        });
        console.log('Status:', res4.status);
        const body4 = await res4.text();
        console.log('Response:', body4.substring(0, 500));

        // Test 5: Flat payload with all typical fields
        console.log('\n=== Test 5: Flat with role ===');
        const res5 = await fetch(ep, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                fullName: 'final testt',
                email: 'finaltest2342423@gmail.com',
                phone: '7654217441',
                role: 'EMPLOYEE'
            })
        });
        console.log('Status:', res5.status);
        const body5 = await res5.text();
        console.log('Response:', body5.substring(0, 500));

    } catch (err) {
        console.error('Fatal:', err);
    }
}

run();
