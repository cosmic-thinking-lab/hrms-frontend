import React, { createContext, useState, useContext, useEffect } from 'react';
import { salarySlips } from '../utils/dummyData';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('hrms_token'));
    const [slips, setSlips] = useState(() => {
        const savedSlips = localStorage.getItem('hrms_slips');
        return savedSlips ? JSON.parse(savedSlips) : salarySlips;
    });

    useEffect(() => {
        localStorage.setItem('hrms_slips', JSON.stringify(slips));
    }, [slips]);

    useEffect(() => {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('hrms_user');
        const storedToken = localStorage.getItem('hrms_token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (employeeId, password) => {
        // API login
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeId, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                const userData = data.user;
                const authToken = data.token;

                let finalUser;

                // Handle ADMIN login
                if (userData.employeeId === 'EMP-ADMIN1' || userData.role === 'ADMIN') {
                    finalUser = {
                        ...userData,
                        role: 'ADMIN',
                        isFirstLogin: false // Force false for admin to skip onboarding
                    };
                } else {
                    // Force role to EMPLOYEE for all other API logins
                    finalUser = {
                        ...userData,
                        role: 'EMPLOYEE'
                    };
                }

                setUser(finalUser);
                setToken(authToken);
                localStorage.setItem('hrms_user', JSON.stringify(finalUser));
                localStorage.setItem('hrms_token', authToken);

                return {
                    success: true,
                    role: finalUser.role,
                    isFirstLogin: finalUser.isFirstLogin
                };
            } else {
                return {
                    success: false,
                    message: data.message || 'Invalid credentials'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('hrms_user');
        localStorage.removeItem('hrms_token');
    };

    const updatePassword = async (newPassword) => {
        // Implementation for password update - currently local only as API endpoint not provided
        if (user) {
            const updatedUser = { ...user, isFirstLogin: false };
            setUser(updatedUser);
            localStorage.setItem('hrms_user', JSON.stringify(updatedUser));
            return true;
        }
        return false;
    };

    const updateUser = (userData) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('hrms_user', JSON.stringify(updatedUser));
        }
    };

    const addSalarySlip = (newSlip) => {
        setSlips(prev => [newSlip, ...prev]);
    };

    const value = {
        user,
        token,
        login,
        logout,
        updatePassword,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isEmployee: user?.role === 'EMPLOYEE',
        salarySlips: slips,
        addSalarySlip,
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
