import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EditarLibro: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [libro, setLibro] = useState({
    Titulo: "",
    Autor: "",
    ISBN: "",
    Editorial: "",
    AnioPublicacion: "",
    CategoriaID: "",
    Estado: "Disponible",
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchLibro(token);
    fetchCategorias(token);
  }, [id, navigate]);

  const fetchLibro = async (token: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/libros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibro(response.data);
    } catch (err) {
      setError("Error al cargar el libro");
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
    } catch (err) {
      setError("Error al cargar las categorías");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLibro({ ...libro, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Verificar tipo y tamaño de la imagen
      if (file.size > 5000000) {
        setError("La imagen no puede ser mayor a 5MB");
      } else if (!file.type.startsWith("image/")) {
        setError("El archivo debe ser una imagen");
      } else {
        setImagen(file);
        setError(""); // Limpiar error si la imagen es válida
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.entries(libro).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imagen) {
        formData.append("Imagen", imagen);
      }
      await axios.put(`http://localhost:3000/api/libros/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setTimeout(() => navigate("/libros"), 1500); // Redirección después de éxito
    } catch (err) {
      setError("Error al actualizar el libro");
    }
  };

  const handleCancel = () => navigate("/libros");

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card p-4">
            <h2 className="text-center mb-4">✏️ Editar Libro</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  name="Titulo"
                  value={libro.Titulo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Autor</label>
                <input
                  type="text"
                  className="form-control"
                  name="Autor"
                  value={libro.Autor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">ISBN</label>
                <input
                  type="text"
                  className="form-control"
                  name="ISBN"
                  value={libro.ISBN}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Editorial</label>
                <input
                  type="text"
                  className="form-control"
                  name="Editorial"
                  value={libro.Editorial}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Año de Publicación</label>
                <input
                  type="text"
                  className="form-control"
                  name="AnioPublicacion"
                  value={libro.AnioPublicacion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                  className="form-control"
                  name="CategoriaID"
                  value={libro.CategoriaID}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar Categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.CategoriaID} value={categoria.CategoriaID}>
                      {categoria.NombreCategoria}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-control"
                  name="Estado"
                  value={libro.Estado}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Disponible">Disponible</option>
                    <option value="Prestado">Prestado</option>
                    <option value="En Reparacion">En Reparacion</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Imagen</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {error && <div className="text-danger mt-2">{error}</div>}
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" className="btn btn-secondary me-md-2" onClick={handleCancel}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarLibro;
