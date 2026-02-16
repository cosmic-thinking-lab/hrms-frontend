# HRMS Portal - Human Resource Management System

A comprehensive, modern HRMS portal built with React, featuring separate interfaces for employees and administrators with beautiful UI/UX design.

## 🌟 Features

### Employee Portal
- **Dashboard**: Overview of attendance, salary, and quick actions
- **Profile Management**: View and manage personal information, education, and experience
- **Attendance Tracking**: View monthly attendance records with statistics
- **Salary Slips**: Access and download monthly salary slips
- **Holiday Calendar**: View company holidays for the year
- **Leave Policy**: Access company leave policies and guidelines
- **Document Upload**: Onboarding document management

### Admin Portal
- **Admin Dashboard**: Workforce overview and system statistics
- **Employee Management**: Add, edit, and delete employee profiles
- **Salary Upload**: Upload monthly salary slips for employees
- **Holiday Management**: Manage company holiday calendar
- **Policy Management**: Update leave policies and company guidelines
- **Random Employee ID Generation**: Automatic unique ID generation for new employees

## 🎨 Design Features

- **Modern UI/UX**: Premium design with gradients, glassmorphism, and smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Color-Coded Stats**: Visual indicators for different data types
- **Interactive Elements**: Hover effects, smooth transitions, and micro-animations
- **Accessible**: Proper semantic HTML and ARIA labels

## 🔐 Demo Credentials

### Employee Login
- **Employee ID**: `EMP-7234`
- **Password**: `password123`

### Admin Login
- **Employee ID**: `ADMIN-1000`
- **Password**: `admin123`

## 📁 Project Structure

```
HRMS/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Reusable layout with sidebar
│   │   ├── Layout.css
│   │   └── ProtectedRoute.jsx  # Route protection component
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Login.css
│   │   ├── EmployeeDashboard.jsx
│   │   ├── EmployeeDashboard.css
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   ├── employee/
│   │   │   ├── Profile.jsx
│   │   │   ├── Profile.css
│   │   │   ├── Attendance.jsx
│   │   │   ├── Attendance.css
│   │   │   ├── SalarySlip.jsx
│   │   │   ├── HolidayList.jsx
│   │   │   ├── LeavePolicy.jsx
│   │   │   └── Onboarding.jsx
│   │   └── admin/
│   │       ├── EmployeeManagement.jsx
│   │       ├── SalaryUpload.jsx
│   │       ├── ManageHolidays.jsx
│   │       └── ManagePolicies.jsx
│   ├── utils/
│   │   └── dummyData.js       # Mock data for demonstration
│   ├── App.jsx                # Main app component with routing
│   ├── App.css
│   ├── index.css              # Global styles
│   └── main.jsx               # App entry point
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd c:\Cosmic-Tech-World\HRMS
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 💾 Dummy Data

The application uses comprehensive dummy data including:
- **3 Employees** with complete profiles
- **1 Admin** user
- **30+ Attendance Records** for January-February 2026
- **3 Salary Slips** with detailed breakdowns
- **14 Company Holidays** for 2026
- **Complete Leave Policy** document

## 🔄 Future Enhancements

### Backend Integration
The frontend is ready to be connected to a backend API. The following endpoints would be needed:

- `POST /api/auth/login` - User authentication
- `GET /api/user/profile` - Get user profile
- `GET /api/user/attendance` - Get attendance records
- `GET /api/user/salary-slips` - Get salary slips
- `POST /api/admin/employees` - Add new employee
- `PUT /api/admin/employees/:id` - Update employee
- `DELETE /api/admin/employees/:id` - Delete employee
- `POST /api/admin/salary-upload` - Upload salary slip
- `GET /api/holidays` - Get holiday list
- `PUT /api/admin/holidays` - Update holidays
- `GET /api/policies` - Get leave policy
- `PUT /api/admin/policies` - Update leave policy

### Additional Features
- Leave application and approval workflow
- Real-time notifications
- Performance appraisal module
- Biometric attendance integration
- Email notifications for salary slips
- Document verification system
- Employee self-service password reset
- Multi-language support
- Dark mode toggle
- Export reports to PDF/Excel

## 🛠️ Technologies Used

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Context API** - State management
- **Vanilla CSS** - Styling (no external CSS frameworks)
- **Vite** - Build tool and dev server

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🎯 Key Features Implemented

✅ Role-based authentication (Employee/Admin)
✅ Protected routes with automatic redirection
✅ Persistent login state (localStorage)
✅ Responsive sidebar navigation
✅ Interactive dashboards with statistics
✅ Month/Year filtering for attendance
✅ Salary slip breakdown display
✅ Holiday calendar with type indicators
✅ Leave policy viewer
✅ Employee management table
✅ Search functionality
✅ File upload interfaces
✅ Modal dialogs
✅ Gradient backgrounds and animations
✅ Hover effects and transitions
✅ Loading states
✅ Error handling

## 📄 License

This project is created for demonstration purposes.

## 👨‍💻 Development

To modify the dummy data, edit `src/utils/dummyData.js`.

To add new routes, update `src/App.jsx` and create corresponding page components.

To customize the theme, modify the CSS variables in `src/index.css`.

## 🐛 Known Limitations

- Currently uses dummy data (no backend integration)
- File uploads are UI-only (not functional without backend)
- No actual PDF generation for salary slips
- No email functionality
- No real-time data updates

## 📞 Support

For questions or issues, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ using React and Vanilla CSS**
