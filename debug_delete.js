
const BASE_URL = process.env.VITE_API_BASE_URL || 'https://apis-hrms.duckdns.org/api/v1';

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
        if (!token) throw new Error('Login failed');
        console.log('Login successful.');

        // Create Dummy
        const createRes = await fetch(`${BASE_URL}/admin/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                personalInfo: { fullName: 'Delete Test', email: `del${Date.now()}@t.com`, phone: '0000000000' },
                role: 'EMPLOYEE'
            })
        });
        const createData = await createRes.json();
        const id = createData.employee?._id;
        console.log(`Created ID: ${id}`);

        const tryEndpoint = async (path) => {
            console.log(`Trying DELETE ${path}...`);
            const res = await fetch(`${BASE_URL}${path}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                console.log('SUCCESS!');
                return true;
            }
            return false;
        };

        const paths = [
            `/admin/employees/${id}`,
            `/admin/employee/${id}`,
            `/employees/${id}`,
            `/employee/${id}`,
            `/users/${id}`,
            `/user/${id}`,
            `/admin/users/${id}`,
            `/admin/user/${id}`
        ];

        for (const path of paths) {
            if (await tryEndpoint(path)) break;
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
