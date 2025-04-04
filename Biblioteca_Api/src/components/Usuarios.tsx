import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/libros.css"; // Asegúrate de que este archivo CSS tenga los estilos correctos para el sidebar

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    Nombre: "",
    Apellido: "",
    Email: "",
    Telefono: "",
    Direccion: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleEditarUsuario = (usuario: any) => {
    navigate(`/usuarios/actualizar/${usuario.UsuarioID}`);
  };
  

  const handleEliminarUsuario = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(usuarios.filter((usuario) => usuario.UsuarioID !== id));
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    }
  };

  const handleCrearUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/api/usuarios", nuevoUsuario, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios([...usuarios, response.data]);
      setNuevoUsuario({ Nombre: "", Apellido: "", Email: "", Telefono: "", Direccion: "" });
    } catch (error) {
      console.error("Error al crear usuario", error);
    }
  };

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav className="sidebar bg-dark text-white p-3">
        <h3 className="text-center">Menú</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => navigate("/libros")}>
              Libros
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => navigate("/categorias")}>
              Categorias
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => navigate("/prestamos")}>
              Préstamos
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => navigate("/usuarios")}>
              Usuarios
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-danger" onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className="container-fluid p-4 ms-250" style={{ transition: "margin-left 0.3s" }}>
        <h2 className="text-center mb-4">Lista de Usuarios</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={nuevoUsuario.Nombre}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, Nombre: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Apellido"
            value={nuevoUsuario.Apellido}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, Apellido: e.target.value })}
          />
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={nuevoUsuario.Email}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, Email: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Teléfono"
            value={nuevoUsuario.Telefono}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, Telefono: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Dirección"
            value={nuevoUsuario.Direccion}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, Direccion: e.target.value })}
          />
          <button className="btn btn-primary mt-2" onClick={handleCrearUsuario}>Agregar Usuario</button>
        </div>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.Nombre}</td>
                <td>{usuario.Apellido}</td>
                <td>{usuario.Email}</td>
                <td>{usuario.Telefono}</td>
                <td>{usuario.Direccion}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditarUsuario(usuario)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleEliminarUsuario(usuario.UsuarioID)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
