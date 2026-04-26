import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userId, setUserId] = useState(null);

    function login(id) {
        setUserId(id);
    };

    function logout() {
        setUserId(null);
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