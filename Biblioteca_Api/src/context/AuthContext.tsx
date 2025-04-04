// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
    token: string | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = async (credentials) => {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem("token", data.token); // Almacena el token en localStorage
            setToken(data.token); // Actualiza el estado del token
        }
    };

    const logout = () => {
        localStorage.removeItem("token"); // Elimina el token
        setToken(null); // Actualiza el estado del token
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};

export default AuthContext;