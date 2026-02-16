// Dummy Data for HRMS Portal

export const employees = [
    {
        _id: '1',
        employeeId: 'EMP-7234',
        password: 'password123',
        isFirstLogin: false,
        role: 'EMPLOYEE',
        personalInfo: {
            firstName: 'Rahul',
            lastName: 'Sharma',
            email: 'rahul.sharma@company.com',
            phone: '+91 98765 43210',
            address: '123, MG Road, Bangalore, Karnataka - 560001',
            dob: '1995-06-15',
            designation: 'Senior Software Engineer',
            department: 'Engineering',
            joiningDate: '2022-03-15'
        },
        education: [
            {
                institution: 'IIT Delhi',
                degree: 'B.Tech in Computer Science',
                yearOfPassing: '2017'
            },
            {
                institution: 'Delhi Public School',
                degree: 'Higher Secondary',
                yearOfPassing: '2013'
            }
        ],
        experience: [
            {
                companyName: 'Tech Solutions Pvt Ltd',
                designation: 'Software Engineer',
                duration: '2017-2020'
            },
            {
                companyName: 'Digital Innovations',
                designation: 'Junior Developer',
                duration: '2020-2022'
            }
        ],
        documents: {
            kycUrl: 'https://example.com/kyc.pdf',
            kycPublicId: 'kyc_123',
            resumeUrl: 'https://example.com/resume.pdf',
            resumePublicId: 'resume_123'
        },
        status: 'ACTIVE',
        createdAt: '2022-03-15T10:00:00Z'
    },
    {
        _id: '2',
        employeeId: 'EMP-5891',
        password: 'password123',
        isFirstLogin: false,
        role: 'EMPLOYEE',
        personalInfo: {
            firstName: 'Priya',
            lastName: 'Patel',
            email: 'priya.patel@company.com',
            phone: '+91 98765 43211',
            address: '456, Park Street, Mumbai, Maharashtra - 400001',
            dob: '1993-08-22',
            designation: 'Product Manager',
            department: 'Product',
            joiningDate: '2021-07-01'
        },
        education: [
            {
                institution: 'IIM Ahmedabad',
                degree: 'MBA',
                yearOfPassing: '2018'
            }
        ],
        experience: [
            {
                companyName: 'Startup Inc',
                designation: 'Product Analyst',
                duration: '2018-2021'
            }
        ],
        documents: {},
        status: 'ACTIVE',
        createdAt: '2021-07-01T10:00:00Z'
    },
    {
        _id: '3',
        employeeId: 'EMP-3456',
        password: 'password123',
        isFirstLogin: false,
        role: 'EMPLOYEE',
        personalInfo: {
            firstName: 'Amit',
            lastName: 'Kumar',
            email: 'amit.kumar@company.com',
            phone: '+91 98765 43212',
            address: '789, Sector 15, Noida, UP - 201301',
            dob: '1996-12-10',
            designation: 'UI/UX Designer',
            department: 'Design',
            joiningDate: '2023-01-10'
        },
        education: [
            {
                institution: 'NID Ahmedabad',
                degree: 'B.Des',
                yearOfPassing: '2019'
            }
        ],
        experience: [
            {
                companyName: 'Creative Agency',
                designation: 'Junior Designer',
                duration: '2019-2023'
            }
        ],
        documents: {},
        status: 'ACTIVE',
        createdAt: '2023-01-10T10:00:00Z'
    }
];

export const admin = {
    _id: 'admin1',
    employeeId: 'ADMIN-1000',
    password: 'admin123',
    role: 'ADMIN',
    personalInfo: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@company.com',
        phone: '+91 98765 00000'
    }
};

export const attendance = [
    // January 2026 - Rahul Sharma (EMP-7234)
    { employeeId: 'EMP-7234', date: '2026-01-01', status: 'HOLIDAY', remarks: 'New Year' },
    { employeeId: 'EMP-7234', date: '2026-01-02', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-03', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-06', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-07', status: 'LEAVE', remarks: 'Sick Leave' },
    { employeeId: 'EMP-7234', date: '2026-01-08', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-09', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-10', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-13', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-14', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-15', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-16', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-17', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-20', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-21', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-22', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-23', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-24', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-26', status: 'HOLIDAY', remarks: 'Republic Day' },
    { employeeId: 'EMP-7234', date: '2026-01-27', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-28', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-29', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-30', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-01-31', status: 'PRESENT', remarks: '' },

    // February 2026 - Rahul Sharma
    { employeeId: 'EMP-7234', date: '2026-02-02', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-03', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-04', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-05', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-06', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-09', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-10', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-11', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-12', status: 'PRESENT', remarks: '' },
    { employeeId: 'EMP-7234', date: '2026-02-13', status: 'PRESENT', remarks: '' },
];

export const salarySlips = [
    {
        _id: 's1',
        employeeId: 'EMP-7234',
        month: 1,
        year: 2026,
        fileUrl: 'https://example.com/salary-jan-2026.pdf',
        filePublicId: 'salary_jan_2026',
        uploadedAt: '2026-02-01T10:00:00Z',
        details: {
            basicSalary: 50000,
            hra: 20000,
            allowances: 10000,
            deductions: 5000,
            netSalary: 75000
        }
    },
    {
        _id: 's2',
        employeeId: 'EMP-7234',
        month: 12,
        year: 2025,
        fileUrl: 'https://example.com/salary-dec-2025.pdf',
        filePublicId: 'salary_dec_2025',
        uploadedAt: '2026-01-01T10:00:00Z',
        details: {
            basicSalary: 50000,
            hra: 20000,
            allowances: 10000,
            deductions: 5000,
            netSalary: 75000
        }
    },
    {
        _id: 's3',
        employeeId: 'EMP-7234',
        month: 11,
        year: 2025,
        fileUrl: 'https://example.com/salary-nov-2025.pdf',
        filePublicId: 'salary_nov_2025',
        uploadedAt: '2025-12-01T10:00:00Z',
        details: {
            basicSalary: 50000,
            hra: 20000,
            allowances: 10000,
            deductions: 5000,
            netSalary: 75000
        }
    }
];

export const holidays = [
    { date: '2026-01-01', name: 'New Year\'s Day', type: 'National' },
    { date: '2026-01-26', name: 'Republic Day', type: 'National' },
    { date: '2026-03-14', name: 'Holi', type: 'Festival' },
    { date: '2026-04-02', name: 'Ram Navami', type: 'Festival' },
    { date: '2026-04-10', name: 'Good Friday', type: 'National' },
    { date: '2026-04-14', name: 'Ambedkar Jayanti', type: 'National' },
    { date: '2026-05-01', name: 'May Day', type: 'National' },
    { date: '2026-08-15', name: 'Independence Day', type: 'National' },
    { date: '2026-08-27', name: 'Janmashtami', type: 'Festival' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National' },
    { date: '2026-10-24', name: 'Dussehra', type: 'Festival' },
    { date: '2026-11-12', name: 'Diwali', type: 'Festival' },
    { date: '2026-11-13', name: 'Diwali (Second Day)', type: 'Festival' },
    { date: '2026-12-25', name: 'Christmas', type: 'National' }
];

export const leavePolicies = [
    {
        type: 'Casual Leave (CL)',
        days: 12,
        description: 'For personal matters, emergencies, or short-term needs. Requires minimum 1 day advance notice.'
    },
    {
        type: 'Sick Leave (SL)',
        days: 12,
        description: 'For medical illness or health-related issues. Medical certificate required for more than 3 consecutive days.'
    },
    {
        type: 'Earned Leave (EL)',
        days: 18,
        description: 'For vacations and extended time off. Requires minimum 7 days advance notice.'
    },
    {
        type: 'Maternity Leave',
        days: 182,
        description: '26 weeks of paid leave for female employees. Notice required 8 weeks before delivery.'
    },
    {
        type: 'Paternity Leave',
        days: 15,
        description: '15 days of paid leave for male employees. Can be taken within 6 months of child birth.'
    },
    {
        type: 'Bereavement Leave',
        days: 5,
        description: '5 days of leave for the death of an immediate family member.'
    }
];

export const leavePolicy = {
    lastUpdated: '2026-01-01',
    content: `
# Leave Policy - 2026

## Types of Leave

### 1. Casual Leave (CL)
- **Entitlement**: 12 days per year
- **Carry Forward**: Maximum 6 days to next year
- **Notice Period**: Minimum 1 day advance notice
- **Purpose**: Personal matters, emergencies, or short-term needs

### 2. Sick Leave (SL)
- **Entitlement**: 12 days per year
- **Carry Forward**: Maximum 30 days accumulation
- **Medical Certificate**: Required for more than 3 consecutive days
- **Purpose**: Medical illness or health-related issues

### 3. Earned Leave (EL) / Privilege Leave (PL)
- **Entitlement**: 18 days per year
- **Carry Forward**: Unlimited accumulation
- **Encashment**: Allowed as per company policy
- **Notice Period**: Minimum 7 days advance notice
- **Purpose**: Vacation, personal time off

### 4. Maternity Leave
- **Entitlement**: 26 weeks (6 months)
- **Eligibility**: Female employees
- **Notice Period**: 8 weeks before expected delivery date

### 5. Paternity Leave
- **Entitlement**: 15 days
- **Eligibility**: Male employees
- **Period**: Within 6 months of child's birth

### 6. Bereavement Leave
- **Entitlement**: 5 days
- **Purpose**: Death of immediate family member
- **Notice**: As soon as possible

## Leave Application Process

1. Submit leave application through HRMS portal
2. Get approval from reporting manager
3. HR will process and update attendance records
4. Leave balance will be updated automatically

## Important Notes

- All leaves are subject to manager approval
- Unauthorized absence will be treated as Leave Without Pay (LWP)
- Public holidays are not counted as leave
- Leave cannot be taken during probation period without approval
- Minimum half-day leave can be applied

## Contact

For any queries regarding leave policy, please contact HR at hr@company.com
  `
};

export const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
