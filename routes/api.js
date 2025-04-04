require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const router = express.Router();
const librosController = require('../controllers/libros');
const usuariosController = require('../controllers/usuarios');
const prestamosController = require('../controllers/prestamos');
const categoriasController = require('../controllers/categorias');
const token = require('../middlewares/auth');
const upload = require('../config/multerConfig');

// ====================== Rutas para Libros ====================== //
router.get('/libros', token, librosController.getlibros);          // Obtener todos los libros
router.post('/libros', token,upload.single('Imagen'), librosController.createLibro);       // Crear un nuevo libro
router.put('/libros/:id', token,upload.single('Imagen'), librosController.updateLibro);    // Actualizar un libro por ID
router.delete('/libros/:id', token, librosController.deleteLibro); // Eliminar un libro por ID
router.get('/libros/:id', token, librosController.getLibroById);   // Obtener un libro por ID
router.get('/libros/categoria/:categoriaId', token, librosController.getLibrosByCategoria); // Obtener libros por categoría

// ====================== Rutas para Usuarios ====================== //
router.get('/usuarios', usuariosController.getUsuarios);          // Obtener todos los usuarios
router.post('/usuarios', usuariosController.createUsuario);       // Crear un usuario
router.put('/usuarios/:id', usuariosController.updateUsuario);    // Actualizar un usuario por ID
router.delete('/usuarios/:id', usuariosController.deleteUsuario); // Eliminar un usuario por ID
router.get('/usuarios/:id', usuariosController.getUsuarioById);   // Obtener un usuario por ID

// ====================== Rutas para Préstamos ====================== //
router.get('/prestamos', token, prestamosController.getPrestamos);          // Obtener todos los préstamos
router.post('/prestamos', token, prestamosController.createPrestamo);       // Crear un préstamo
router.put('/prestamos/:id', token, prestamosController.updatePrestamo);    // Actualizar un préstamo por ID
router.delete('/prestamos/:id', token, prestamosController.deletePrestamo); // Eliminar un préstamo por ID
router.get('/prestamos/:id', token, prestamosController.getPrestamoById);   // Obtener un préstamo por ID
router.get('/prestamos/usuario/:usuarioId', token, prestamosController.getPrestamosByUsuario); // Obtener préstamos por usuario
router.get('/prestamos/libro/:libroId', token, prestamosController.getPrestamosByLibro); // Obtener préstamos por libro

// ====================== Rutas para Categorías ====================== //
router.get('/categorias', token, categoriasController.getcategorias);          // Obtener todas las categorías
router.post('/categorias', token, categoriasController.createCategoria);       // Crear una categoría
router.put('/categorias/:id', token, categoriasController.updateCategoria);    // Actualizar una categoría por ID
router.delete('/categorias/:id', token, categoriasController.deleteCategoria); // Eliminar una categoría por ID
router.get('/categorias/:id', token, categoriasController.getCategoriaById);   // Obtener una categoría por ID

module.exports = router;
