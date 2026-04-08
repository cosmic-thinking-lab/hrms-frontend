import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('hrms_token'));

    useEffect(() => {
        const storedUser = localStorage.getItem('hrms_user');
        const storedToken = localStorage.getItem('hrms_token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (employeeId, password) => {
        try {
            const data = await authAPI.login(employeeId, password);

            if (data?.token) {
                const userData = data.user;
                const authToken = data.token;
                const finalUser = { ...userData, role: userData.role || 'EMPLOYEE' };

                setUser(finalUser);
                setToken(authToken);
                localStorage.setItem('hrms_user', JSON.stringify(finalUser));
                localStorage.setItem('hrms_token', authToken);

                return { success: true, role: finalUser.role, isFirstLogin: finalUser.isFirstLogin };
            } else {
                return { success: false, message: data.message || 'Invalid credentials' };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('hrms_user');
        localStorage.removeItem('hrms_token');
    };

    const updateUser = (userData) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('hrms_user', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user, token, login, logout, loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
        isEmployee: user?.role === 'EMPLOYEE',
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
