import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ActualizarCategoria: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [categoria, setCategoria] = useState({
    NombreCategoria: "",
    Descripcion: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchCategoria(token);
  }, [id]);

  const fetchCategoria = async (token: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategoria({
        NombreCategoria: response.data.NombreCategoria,
        Descripcion: response.data.Descripcion,
      });
    } catch (err) {
      setError("Error al cargar la categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoria({
      ...categoria,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmUpdate = window.confirm("¿Estás seguro de que deseas actualizar esta categoría?");
    if (confirmUpdate) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:3000/api/categorias/${id}`, categoria, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Categoría actualizada correctamente");
        setTimeout(() => {
          navigate("/categorias");
        }, 1500);
      } catch (err) {
        setError("Error al actualizar la categoría");
      }
    }
  };

  const handleCancel = () => {
    navigate("/categorias");
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-10 col-lg-8">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white text-center py-3">
            <h2 className="card-title mb-0">
              <i className="bi bi-pencil-square me-2"></i>
              Editar Categoría
            </h2>
          </div>
  
          <div className="card-body p-4">
            {success && (
              <div className="alert alert-success alert-dismissible fade show">
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}
  
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="nombreCategoria"
                      name="NombreCategoria"
                      placeholder="Nombre de la categoría"
                      value={categoria.NombreCategoria}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="nombreCategoria">Nombre de la categoría</label>
                  </div>
                </div>
              </div>
  
              <div className="d-flex justify-content-center mt-4 pt-3 border-top">
  <button
    type="button"
    className="btn btn-outline-secondary me-3"
    onClick={handleCancel}
  >
    <i className="bi bi-x-circle me-2"></i>
    Cancelar
  </button>
  <button type="submit" className="btn btn-primary">
    <i className="bi bi-save me-2"></i>
    Guardar Cambios
  </button>
</div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default ActualizarCategoria;
