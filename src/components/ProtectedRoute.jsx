import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Handle First Login Password Setup
    if (user?.isFirstLogin && location.pathname !== '/set-password') {
        return <Navigate to="/set-password" replace />;
    }

    // Prevent access to set-password if not first login
    if (!user?.isFirstLogin && location.pathname === '/set-password') {
        return <Navigate to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"} replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/employee/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
