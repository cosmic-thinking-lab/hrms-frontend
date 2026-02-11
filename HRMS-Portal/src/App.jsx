import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Notices from './pages/Notices';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Home from './pages/Home';
import { Onboarding, Recruitment, Performance, Travel, Tasks, IntegrationHelp } from './pages/Modules';
import { initScrollAnimations } from './utils/scrollAnimations';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('home');

    useEffect(() => {
        // Initialize scroll animations when component mounts
        const timer = setTimeout(() => {
            initScrollAnimations();
        }, 100);

        return () => clearTimeout(timer);
    }, [currentPage]); // Re-initialize when page changes

    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <Home setCurrentPage={setCurrentPage} />;
            case 'dashboard': return <Dashboard />;
            case 'employees': return <Employees />;
            case 'departments': return <Departments />;
            case 'attendance': return <Attendance />;
            case 'leaves': return <Leaves />;
            case 'payroll': return <Payroll />;
            case 'notices': return <Notices />;
            case 'documents': return <Documents />;
            case 'settings': return <Settings />;
            case 'onboarding': return <Onboarding />;
            case 'recruitment': return <Recruitment />;
            case 'performance': return <Performance />;
            case 'travel': return <Travel />;
            case 'tasks': return <Tasks />;
            case 'help': return <IntegrationHelp />;
            default: return <Dashboard />;
        }
    };

    return (
        <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
            {renderPage()}
        </Layout>
    );
}

export default App;
