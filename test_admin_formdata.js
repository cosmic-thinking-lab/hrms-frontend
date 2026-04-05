
async function run() {
    try {
        const BASE_URL = 'http://64.227.146.144:3001/api/v1';
        const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTg0ZDY2YmZmMmFhOWI5MmU3ZWVlYzkiLCJlbXBsb3llZUlkIjoiRU1QLUFETUlOMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NDc4MDY2NSwiZXhwIjoxNzc0ODY3MDY1fQ.nzUV9TNyJW8EeRwOurtJyPDq8Wq6KplhrMMrFu8aryQ';

        console.log('\n=== Test Admin PATCH with FormData ===');
        
        const fd = new FormData();
        fd.append('docNames', 'Fixed Document');
        const blob = new Blob(['dummy'], { type: 'application/pdf' });
        fd.append('files', blob, 'fixed.pdf');

        const res = await fetch(`${BASE_URL}/admin/employees/EMP-WO6XYW`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${TOKEN}`
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
