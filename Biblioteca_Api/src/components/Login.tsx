import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/login.css"; // Importamos los estilos
import logo from "./imagenes/logo.jpg"; // Importamos la imagen
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });

      localStorage.setItem("token", response.data.token); // Guarda el token en localStorage

      navigate("/libros"); // Redirige a la sección de libros
    } catch (err) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div id="contenedor">
      <div id="contenedorcentrado">
        <div id="login">
          <form id="loginform" onSubmit={handleLogin}>
          <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="error-message">{error}</div>}

            <button type="submit" title="Ingresar" name="Ingresar">
              Login
            </button>
          </form>
        </div>

        <div id="derecho">
          <div className="titulo">Bienvenido</div>
          <hr />
          <div className="pie-form">
            <img src={logo} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
