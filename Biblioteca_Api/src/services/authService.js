// src/services/authService.js
export const login = async (credentials) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token); // Almacena el token en localStorage
    }
    return data;
};