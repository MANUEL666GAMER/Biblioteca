const express = require('express');
const router = express.Router();
const librosController = require('../controllers/libros');
const usuariosController = require('../controllers/usuarios');
const prestamosController = require('../controllers/prestamos');
const categoriasController = require('../controllers/categorias');

// Rutas para libros
router.get('/libros', librosController.getLibros);
router.post('/libros', librosController.createLibro);
router.put('/libros/:id', librosController.updateLibro);

// Rutas para usuarios
router.get('/usuarios', usuariosController.getUsuarios);
router.post('/usuarios', usuariosController.createUsuario);
router.put('/usuarios/:id', usuariosController.updateUsuario);

// Rutas para préstamos
router.get('/prestamos', prestamosController.getPrestamos);
router.post('/prestamos', prestamosController.createPrestamo);
router.put('/prestamos/:id', prestamosController.updatePrestamo);   

// Rutas para categorías
router.get('/categorias', categoriasController.getCategorias);
router.post('/categorias', categoriasController.createCategoria);
router.put('/categorias/:id', categoriasController.updateCategoria);    

module.exports = router;