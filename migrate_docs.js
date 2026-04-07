const BASE_URL = process.env.VITE_API_BASE_URL || 'https://apis-hrms.duckdns.org/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTg0ZDY2YmZmMmFhOWI5MmU3ZWVlYzkiLCJlbXBsb3llZUlkIjoiRU1QLUFETUlOMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NDc4MDEwNiwiZXhwIjoxNzc0ODY2NTA2fQ.HRCGgEquY7hEzQl0V5sxiRoNx47oE7M7dECfjlqPMtA';

async function migrate() {
    try {
        console.log('Fetching all employees...');
        const res = await fetch(`${BASE_URL}/admin/employees?limit=200`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        const employees = data.employees || [];
        console.log(`Found ${employees.length} employees.`);

        for (const emp of employees) {
            const hasLegacyDocs = emp.documents && emp.documents.some(doc => typeof doc === 'string');
            
            if (hasLegacyDocs) {
                console.log(`Migrating documents for ${emp.employeeId} (${emp.personalInfo?.fullName || 'N/A'})...`);
                
                const updatedDocs = emp.documents.map((doc, idx) => {
                    if (typeof doc === 'string') {
                        return {
                            name: `Document ${idx + 1}`,
                            url: doc
                        };
                    }
                    return doc; // Already an object
                });

                // Update using Admin API
                // Assuming PATCH /admin/employees/:id works for updating documents
                const updateRes = await fetch(`${BASE_URL}/admin/employees/${emp._id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${TOKEN}`
                    },
                    body: JSON.stringify({ documents: updatedDocs })
                });

                if (updateRes.status === 200) {
                    console.log(`Successfully migrated ${emp.employeeId}.`);
                } else {
                    const error = await updateRes.text();
                    console.error(`Failed to migrate ${emp.employeeId}: status ${updateRes.status}`, error);
                }
            }
        }
        console.log('Migration complete.');
    } catch (err) {
        console.error('Fatal Migration Error:', err);
    }
}

migrate();
