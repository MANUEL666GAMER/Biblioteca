import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importar los componentes necesarios de react-router-dom
import Login from './components/Login'; 
import Libros from './components/Libros.tsx';
import ActualizarLibro from './components/ActualizarLibro.tsx';
import Categotrias from './components/Categorias.tsx';
import ActualizarCategoria from './components/ActualizarCategorias.tsx';
import Usuarios from './components/Usuarios.tsx';
import ActualizarUsuario from './components/ActualizarUsuarios.tsx';
import Prestamos from './components/Prestamos.tsx';
import ActualizarPrestamos from './components/ActualizarPrestamos.tsx';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/libros" element={<Libros/>} />
        <Route path="/libros/actualizar/:id" element={<ActualizarLibro/>} />
        <Route path="/categorias" element={<Categotrias/>} />
        <Route path="/categorias/actualizar/:id" element={<ActualizarCategoria/>} />
        <Route path="/usuarios" element={<Usuarios/>} />
        <Route path="/usuarios/actualizar/:id" element={<ActualizarUsuario/>} />
        <Route path="/prestamos" element={<Prestamos/>} />
        <Route path="/prestamos/actualizar/:id" element={<ActualizarPrestamos/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
