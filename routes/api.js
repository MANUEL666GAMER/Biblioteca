const express = require('express');
const router = express.Router();
const librosController = require('../controllers/libros');
const usuariosController = require('../controllers/usuarios');
const prestamosController = require('../controllers/prestamos');
const categoriasController = require('../controllers/categorias');

// ====================== Rutas para Libros ====================== //
router.get('/libros', librosController.getLibros);          // Obtener todos los libros
router.post('/libros', librosController.createLibro);       // Crear un nuevo libro
router.put('/libros/:id', librosController.updateLibro);    // Actualizar un libro por ID
router.delete('/libros/:id', librosController.deleteLibro); // Eliminar un libro por ID

// ====================== Rutas para Usuarios ====================== //
router.get('/usuarios', usuariosController.getUsuarios);          // Obtener todos los usuarios
router.post('/usuarios', usuariosController.createUsuario);       // Crear un usuario
router.put('/usuarios/:id', usuariosController.updateUsuario);    // Actualizar un usuario por ID
router.delete('/usuarios/:id', usuariosController.deleteUsuario); // Eliminar un usuario por ID

// ====================== Rutas para Préstamos ====================== //
router.get('/prestamos', prestamosController.getPrestamos);          // Obtener todos los préstamos
router.post('/prestamos', prestamosController.createPrestamo);       // Crear un préstamo
router.put('/prestamos/:id', prestamosController.updatePrestamo);    // Actualizar un préstamo por ID
router.delete('/prestamos/:id', prestamosController.deletePrestamo); // Eliminar un préstamo por ID

// ====================== Rutas para Categorías ====================== //
router.get('/categorias', categoriasController.getCategorias);          // Obtener todas las categorías
router.post('/categorias', categoriasController.createCategoria);       // Crear una categoría
router.put('/categorias/:id', categoriasController.updateCategoria);    // Actualizar una categoría por ID
router.delete('/categorias/:id', categoriasController.deleteCategoria); // Eliminar una categoría por ID

module.exports = router;
