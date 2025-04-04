import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/libros.css";
import Prestamos from './Prestamos';

const Libros: React.FC = () => {
  const [libros, setLibros] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriasMap, setCategoriasMap] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [nuevoLibro, setNuevoLibro] = useState({
    Titulo: "",
    Autor: "",
    ISBN: "",
    Editorial: "",
    AnioPublicacion: "",
    CategoriaID: "",
    Estado: "Disponible",
    Imagen: null as File | null,
  });
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchLibros(token);
    fetchCategorias(token);
  }, []);

  useEffect(() => {
    console.log(libros); // Verifica que la imagen se está cargando correctamente
  }, [libros]);
  

  const fetchLibros = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/libros", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibros(
        response.data.map((libro) => ({
          id: libro.LibroID,
          titulo: libro.Titulo,
          autor: libro.Autor,
          ISBN: libro.ISBN,
          editorial: libro.Editorial,
          anioPublicacion: libro.AnioPublicacion,
          categoriaID: libro.CategoriaID,
          estado: libro.Estado,
          Imagen: libro.Imagen,
        }))
      );
    } catch (err) {
      setError("Error al cargar los libros");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias(response.data);
      const categoriasMap = response.data.reduce((acc: { [key: number]: string }, categoria: any) => {
        acc[categoria.CategoriaID] = categoria.NombreCategoria;
        return acc;
      }, {});
      setCategoriasMap(categoriasMap);
    } catch (err) {
      setError("Error al cargar las categorías");
    }
  };

  const handleCrearLibro = async () => {
    const formData = new FormData();
    formData.append("Titulo", nuevoLibro.Titulo);
    formData.append("Autor", nuevoLibro.Autor);
    formData.append("ISBN", nuevoLibro.ISBN);
    formData.append("Editorial", nuevoLibro.Editorial);
    formData.append("AnioPublicacion", nuevoLibro.AnioPublicacion);
    formData.append("CategoriaID", nuevoLibro.CategoriaID);
    formData.append("Estado", nuevoLibro.Estado);

    // Ensure the image file is appended correctly
    if (nuevoLibro.Imagen) {
        formData.append("Imagen", nuevoLibro.Imagen);
    }

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:3000/api/libros", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", // Make sure the content type is multipart
            },
        });
        setLibros([...libros, response.data]);
        setNuevoLibro({
            Titulo: "",
            Autor: "",
            ISBN: "",
            Editorial: "",
            AnioPublicacion: "",
            CategoriaID: "",
            Estado: "Disponible",
            Imagen: null,
        });
    } catch (err) {
        setError("Error al crear el libro");
    }
};


  const handleEliminarLibro = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este libro?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/libros/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLibros(libros.filter((libro) => libro.id !== id));
      } catch (err) {
        setError("Error al eliminar el libro");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEditarLibro = (id: number) => {
    navigate(`/libros/actualizar/${id}`);
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
            <button className="nav-link text-danger" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className={`container-fluid p-4 ${sidebarVisible ? "ms-250" : ""}`} style={{ transition: "margin-left 0.3s" }}>
        <h2 className="text-center mb-4">📖 Lista de Libros</h2>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="p-4 bg-light rounded shadow-sm">
              <h5 className="mb-4">➕ Agregar Nuevo Libro</h5>

              {/* Formulario de agregar libro */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Título"
                    value={nuevoLibro.Titulo}
                    onChange={(e) => setNuevoLibro({ ...nuevoLibro, Titulo: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Autor"
                    value={nuevoLibro.Autor}
                    onChange={(e) => setNuevoLibro({ ...nuevoLibro, Autor: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ISBN"
                    value={nuevoLibro.ISBN}
                    onChange={(e) => setNuevoLibro({ ...nuevoLibro, ISBN: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Editorial"
                    value={nuevoLibro.Editorial}
                    onChange={(e) => setNuevoLibro({ ...nuevoLibro, Editorial: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Año de Publicación"
                    value={nuevoLibro.AnioPublicacion}
                    onChange={(e) => setNuevoLibro({ ...nuevoLibro, AnioPublicacion: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <select
                    className="form-control"
                    value={nuevoLibro.CategoriaID}
                    onChange={(e) => setNuevoLibro({ ...nuevoLibro, CategoriaID: e.target.value })}
                  >
                    <option value="">Seleccionar Categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.CategoriaID} value={categoria.CategoriaID}>
                        {categoria.NombreCategoria}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <select
                    className="form-control"
                    value={nuevoLibro.Estado}
                    onChange={(e) => setNuevoLibro({ ...nuevoLibro, Estado: e.target.value })}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Prestado">Prestado</option>
                    <option value="En Reparacion">En Reparacion</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Imagen del libro</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setNuevoLibro({ ...nuevoLibro, Imagen: e.target.files![0] })}
                  />
                </div>
                <div className="col-md-12 text-center">
                  <button
                    className="btn btn-primary"
                    onClick={handleCrearLibro}
                    disabled={loading}
                  >   
                    {loading ? "Creando..." : "Crear Libro"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de libros */}
        <div className="row">
          {libros.map((libro) => (
            <div className="col-md-4 mb-4" key={libro.id}>
              <div className="card shadow-sm">
                <img
                  src={libro.Imagen ? `http://localhost:3000/uploads/${libro.Imagen}` : "/default-image.jpg"}
                  className="card-img-top"
                  alt={libro.titulo}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{libro.titulo}</h5>
                  <p className="card-text">Autor: {libro.autor}</p>
                  <p className="card-text">ISBN: {libro.ISBN}</p>
                  <p className="card-text">Editorial: {libro.editorial}</p>
                  <p className="card-text">Año de Publicación: {libro.anioPublicacion}</p>
                  <p className="card-text">Categoría: {categoriasMap[libro.categoriaID]}</p>
                  <p className="card-text">Estado: {libro.estado}</p>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditarLibro(libro.id)}
                  >
                    Editar
                  </button>{" "}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminarLibro(libro.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Libros;
