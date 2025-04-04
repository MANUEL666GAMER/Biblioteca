import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/libros.css";

const Prestamos: React.FC = () => {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [libros, setLibros] = useState<any[]>([]);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    UsuarioID: "",
    LibroID: "",
    FechaPrestamo: "",
    FechaDevolucion: "",
    EstadoPrestamo: "",
  });
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchPrestamos(token);
    fetchUsuarios(token);
    fetchLibros(token);
  }, []);

  const fetchPrestamos = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/prestamos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrestamos(response.data);
    } catch (err) {
      console.error("Error al cargar los préstamos");
    }
  };

  const fetchUsuarios = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
    } catch (err) {
      console.error("Error al cargar los usuarios");
    }
  };

  const fetchLibros = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/libros", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibros(response.data);
    } catch (err) {
      console.error("Error al cargar los libros");
    }
  };

  const handleCrearPrestamo = async () => {
    // Validación de fechas
    if (new Date(nuevoPrestamo.FechaDevolucion) <= new Date(nuevoPrestamo.FechaPrestamo)) {
      alert("La fecha de devolución debe ser mayor que la fecha de préstamo.");
      return;
    }
  
    // Verificar si el libro ya está prestado y aún no ha sido devuelto
    const libroYaPrestado = prestamos.some((prestamo) => {
      return (
        prestamo.LibroID === nuevoPrestamo.LibroID && // Mismo libro
        ["Activo", "Pendiente", "Atrasado"].includes(prestamo.EstadoPrestamo) // No ha sido devuelto
      );
    });
  
    if (libroYaPrestado) {
      alert("Este libro ya está prestado y aún no ha sido devuelto.");
      return;
    }
  
    // Registrar el préstamo si pasa todas las validaciones
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/prestamos", nuevoPrestamo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPrestamos(token);
      setNuevoPrestamo({
        UsuarioID: "",
        LibroID: "",
        FechaPrestamo: "",
        FechaDevolucion: "",
        EstadoPrestamo: "",
      });
    } catch (err) {
      console.error("Error al registrar el préstamo", err);
    }
  };
  
  
  

  // Filtrar los préstamos por estado
  const prestamosFiltrados = filtroEstado
    ? prestamos.filter((prestamo) => prestamo.EstadoPrestamo === filtroEstado)
    : prestamos;

  // Función para manejar el botón de editar
  const handleEditarPrestamo = (id: number) => {
    navigate(`/prestamos/actualizar/${id}`);
  };

  // Función para manejar el botón de eliminar con confirmación
  const handleEliminarPrestamo = async (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este préstamo?"
    );
    if (confirmacion) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/prestamos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPrestamos(token);  // Refresca la lista después de eliminar
      } catch (err) {
        console.error("Error al eliminar el préstamo", err);
      }
    }
  };
  
  

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav
        className={`sidebar bg-dark text-white p-3 ${
          sidebarVisible ? "" : "d-none"
        }`}
      >
        <h3 className="text-center">Menú</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className="nav-link text-white"
              onClick={() => navigate("/libros")}
            >
              Libros
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link text-white"
              onClick={() => navigate("/categorias")}
            >
              Categorías
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link text-white"
              onClick={() => navigate("/prestamos")}
            >
              Préstamos
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link text-white"
              onClick={() => navigate("/usuarios")}
            >
              Usuarios
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link text-danger"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className={`container-fluid p-4 ${sidebarVisible ? "ms-250" : ""}`}>
        <h2 className="text-center mb-4">📋 Lista de Préstamos</h2>

        {/* Formulario de registro de préstamo */}
        <div className="p-4 bg-light rounded shadow-sm">
          <h5 className="mb-4">➕ Registrar Nuevo Préstamo</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={nuevoPrestamo.UsuarioID}
                onChange={(e) =>
                  setNuevoPrestamo({
                    ...nuevoPrestamo,
                    UsuarioID: e.target.value,
                  })
                }
              >
                <option value="">Seleccionar Usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.UsuarioID} value={usuario.UsuarioID}>
                    {usuario.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={nuevoPrestamo.LibroID}
                onChange={(e) =>
                  setNuevoPrestamo({
                    ...nuevoPrestamo,
                    LibroID: e.target.value,
                  })
                }
              >
                <option value="">Seleccionar Libro</option>
                {libros.map((libro) => (
                  <option key={libro.LibroID} value={libro.LibroID}>
                    {libro.Titulo}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="date"
                className="form-control"
                value={nuevoPrestamo.FechaPrestamo}
                onChange={(e) =>
                  setNuevoPrestamo({
                    ...nuevoPrestamo,
                    FechaPrestamo: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="date"
                className="form-control"
                value={nuevoPrestamo.FechaDevolucion}
                onChange={(e) =>
                  setNuevoPrestamo({
                    ...nuevoPrestamo,
                    FechaDevolucion: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={nuevoPrestamo.EstadoPrestamo}
                onChange={(e) =>
                  setNuevoPrestamo({
                    ...nuevoPrestamo,
                    EstadoPrestamo: e.target.value,
                  })
                }
              >
                <option value="">Estado</option>
                <option value="Activo">Activo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Devuelto">Devuelto</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>

            <div className="col-md-12 text-center">
              <button className="btn btn-primary" onClick={handleCrearPrestamo}>
                Registrar Préstamo
              </button>
            </div>
          </div>
        </div>

        {/* Filtro de Estado */}
        <div className="d-flex justify-content-center mb-4">
          <button
            className="btn btn-info mx-2"
            onClick={() => setFiltroEstado("Activo")}
          >
            Activo
          </button>
          <button
            className="btn btn-warning mx-2"
            onClick={() => setFiltroEstado("Devuelto")}
          >
            Devuelto
          </button>
          <button
            className="btn btn-danger mx-2"
            onClick={() => setFiltroEstado("Atrasado")}
          >
            Atrasado
          </button>
          <button
            className="btn btn-secondary mx-2"
            onClick={() => setFiltroEstado("")}
          >
            Todos
          </button>
        </div>

        {/* Tabla de préstamos */}
        <div className="table-responsive mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Libro</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamosFiltrados.map((prestamo) => (
                <tr key={prestamo.PrestamoID}>
                  <td>
                    {usuarios.find((u) => u.UsuarioID === prestamo.UsuarioID)
                      ?.Nombre || "Desconocido"}
                  </td>
                  <td>
                    {libros.find((l) => l.LibroID === prestamo.LibroID)
                      ?.Titulo || "Desconocido"}
                  </td>
                  <td>{prestamo.FechaPrestamo}</td>
                  <td>{prestamo.FechaDevolucion}</td>
                  <td>{prestamo.EstadoPrestamo}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mx-2"
                      onClick={() => handleEditarPrestamo(prestamo.PrestamoID)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminarPrestamo(prestamo.PrestamoID)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Prestamos;
