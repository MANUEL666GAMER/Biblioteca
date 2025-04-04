import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    Nombre: "",
    Apellido: "",
    Email: "",
    Telefono: "",
    Direccion: "",
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(response.data);
      } catch (error) {
        console.error("Error al cargar el usuario", error);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleActualizarUsuario = async () => {
    const confirmUpdate = window.confirm("¿Estás seguro de que deseas actualizar este Usuario?");
    if (confirmUpdate){
    window.alert("Usuario actualizado correctamente");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/usuarios/${id}`, usuario, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/usuarios"); // Redirige a la lista de usuarios después de actualizar
    } catch (error) {
      console.error("Error al actualizar el usuario", error);
    }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Editar Usuario</h2>
      <div className="card p-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nombre"
          value={usuario.Nombre}
          onChange={(e) => setUsuario({ ...usuario, Nombre: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Apellido"
          value={usuario.Apellido}
          onChange={(e) => setUsuario({ ...usuario, Apellido: e.target.value })}
        />
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={usuario.Email}
          onChange={(e) => setUsuario({ ...usuario, Email: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Teléfono"
          value={usuario.Telefono}
          onChange={(e) => setUsuario({ ...usuario, Telefono: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Dirección"
          value={usuario.Direccion}
          onChange={(e) => setUsuario({ ...usuario, Direccion: e.target.value })}
        />
        <button className="btn btn-primary" onClick={handleActualizarUsuario}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default EditarUsuario;
