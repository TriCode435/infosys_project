import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (storedUser && token && storedUser !== 'undefined') {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Auth initialization failed", e);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (username, password, role) => {
        try {
            const response = await apiLogin({ username, password, role });
            const { token, role: userRole } = response.data;
            const userData = { username, role: userRole };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true, role: userRole };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (username, email, password, role) => {
        try {
            await apiRegister({ username, email, password, role });
            return { success: true };
        } catch (error) {
            const errorData = error.response?.data;
            let message = 'Registration failed';

            if (typeof errorData === 'string') message = errorData;
            else if (errorData?.error) message = errorData.error;
            else if (errorData?.message) message = errorData.message;
            else if (typeof errorData === 'object' && errorData !== null) message = errorData;

            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
