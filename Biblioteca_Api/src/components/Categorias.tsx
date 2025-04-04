import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/categorias.css"; // Cambia el nombre del archivo CSS
import Usuarios from './Usuarios';

const Categorias: React.FC = () => {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [nuevoCategoria, setNuevoCategoria] = useState({
        NombreCategoria: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        fetchCategorias(token);
    }, []);

    const fetchCategorias = async (token: string) => {
        try {
            const response = await axios.get("http://localhost:3000/api/categorias", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategorias(response.data);
        } catch (err) {
            setError("Error al cargar las categorías");
        } finally {
            setLoading(false);
        }
    };

    const handleCrearCategoria = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3000/api/categorias",
                nuevoCategoria,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCategorias([...categorias, response.data]);
            setNuevoCategoria({ NombreCategoria: "" });
        } catch (err) {
            setError("Error al crear la categoría");
        }
    };

    const handleEliminarCategoria = async (id: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta categoría?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:3000/api/categorias/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategorias(categorias.filter((categoria) => categoria.CategoriaID !== id));
            } catch (err) {
                setError("Error al eliminar la categoría");
            }
        }
    };

    const handleEditarCategoria = (id: number) => {
        navigate(`/categorias/actualizar/${id}`);
    };

    if (loading) return <div className="text-center mt-5">Cargando...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;

    return (
        <div className="d-flex vh-100">
            {/* Sidebar */}
            <nav className={`sidebar bg-dark text-white p-3 ${sidebarVisible ? "" : "d-none"}`}>
                <h3 className="text-center">Menú</h3>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <button className="nav-link text-white" onClick={() => navigate("/libros")}>
                            Libros
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link text-white" onClick={() => navigate("/categorias")}>
                            Categorías
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
                        <button className="nav-link text-danger" onClick={() => localStorage.removeItem("token")}>
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Contenido principal */}
            <div className={`container-fluid p-4 ${sidebarVisible ? "ms-250" : ""}`} style={{ transition: "margin-left 0.3s" }}>
                <h2 className="text-center mb-4">📚 Lista de Categorías</h2>

                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="p-4 bg-light rounded shadow-sm">
                            <h5 className="mb-4">➕ Agregar Nueva Categoría</h5>

                            {/* Formulario de agregar categoría */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre de la categoría"
                                        value={nuevoCategoria.NombreCategoria}
                                        onChange={(e) => setNuevoCategoria({ NombreCategoria: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-12 text-center">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleCrearCategoria}
                                    >
                                        Agregar Categoría
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de categorías */}
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Nombre de la Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((categoria) => (
                                <tr key={categoria.CategoriaID}>
                                    <td>{categoria.NombreCategoria}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEditarCategoria(categoria.CategoriaID)}
                                        >
                                            Editar
                                        </button>{" "}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleEliminarCategoria(categoria.CategoriaID)}
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

export default Categorias;
