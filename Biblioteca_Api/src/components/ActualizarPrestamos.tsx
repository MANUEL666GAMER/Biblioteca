import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EditarPrestamo: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID del préstamo desde la URL
  const [prestamo, setPrestamo] = useState<any>({
    UsuarioID: "",
    LibroID: "",
    FechaPrestamo: "",
    FechaDevolucion: "",
    EstadoPrestamo: "",
  });
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [libros, setLibros] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchPrestamo(token);
    fetchUsuarios(token);
    fetchLibros(token);
  }, [id]);

  const fetchPrestamo = async (token: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/prestamos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrestamo(response.data);
    } catch (err) {
      setError("Error al cargar el préstamo. Verifica que el préstamo exista.");
    }
  };

  const fetchUsuarios = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
    } catch (err) {
      setError("Error al cargar los usuarios.");
    }
  };

  const fetchLibros = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/libros", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibros(response.data);
    } catch (err) {
      setError("Error al cargar los libros.");
    }
  };

  const handleActualizarPrestamo = async () => {
    // Validar campos requeridos
    if (!prestamo.UsuarioID || !prestamo.LibroID || !prestamo.FechaPrestamo || !prestamo.FechaDevolucion || !prestamo.EstadoPrestamo) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/prestamos/${id}`, prestamo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/prestamos"); // Redirigir a la lista de préstamos después de actualizar
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError("Error al actualizar el préstamo. Verifica los datos enviados.");
      } else {
        setError("Error al actualizar el préstamo. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">✏️ Editar Préstamo</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="p-4 bg-light rounded shadow-sm">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Usuario</label>
            <select
              className="form-control"
              value={prestamo.UsuarioID}
              onChange={(e) => setPrestamo({ ...prestamo, UsuarioID: e.target.value })}
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
            <label>Libro</label>
            <select
              className="form-control"
              value={prestamo.LibroID}
              onChange={(e) => setPrestamo({ ...prestamo, LibroID: e.target.value })}
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
            <label>Fecha de Préstamo</label>
            <input
              type="date"
              className="form-control"
              value={prestamo.FechaPrestamo}
              onChange={(e) => setPrestamo({ ...prestamo, FechaPrestamo: e.target.value })}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Fecha de Devolución</label>
            <input
              type="date"
              className="form-control"
              value={prestamo.FechaDevolucion}
              onChange={(e) => setPrestamo({ ...prestamo, FechaDevolucion: e.target.value })}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Estado del Préstamo</label>
            <select
              className="form-control"
              value={prestamo.EstadoPrestamo}
              onChange={(e) => setPrestamo({ ...prestamo, EstadoPrestamo: e.target.value })}
            >
              <option value="">Seleccionar Estado</option>
              <option value="Activo">Activo</option>
              <option value="Devuelto">Devuelto</option>
              <option value="Atrasado">Atrasado</option>
            </select>
          </div>
          <div className="col-md-12 text-center">
            <button className="btn btn-primary" onClick={handleActualizarPrestamo}>
              Guardar Cambios
            </button>
            <button
              className="btn btn-secondary ms-3"
              onClick={() => navigate("/prestamos")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarPrestamo;