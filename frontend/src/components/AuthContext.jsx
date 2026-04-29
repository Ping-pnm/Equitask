import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userId, setUserId] = useState(() => {
        return sessionStorage.getItem('isAuthenticated') || null;
    });

    function login(id) {
        setUserId(id);
        sessionStorage.setItem('isAuthenticated', id);
    };

    function logout() {
        setUserId(null);
        sessionStorage.removeItem('isAuthenticated');
    };

    const isAuthenticated = Boolean(userId);

    return (
        <AuthContext.Provider value={{ userId, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}