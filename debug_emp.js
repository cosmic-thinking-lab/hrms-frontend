// Using native fetch

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

        console.log('Fetching all employees to find EMP-WO6XYW...');
        const empRes = await fetch(`${BASE_URL}/admin/employees`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const empData = await empRes.json();
        const employees = empData.data || empData.employees || [];
        const emp = employees.find(e => e.employeeId === 'EMP-WO6XYW');
        
        if (emp) {
            console.log('Found employee:', emp.employeeId);
            console.log('Documents array:', JSON.stringify(emp.documents, null, 2));
            console.log('Mongo ID:', emp._id);
        } else {
            console.log('Employee EMP-WO6XYW not found');
        }

    } catch (err) {
        console.error('Fatal:', err);
    }
}

run();
