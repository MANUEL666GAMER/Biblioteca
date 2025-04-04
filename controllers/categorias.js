const db = require('../config/db'); // Importa la conexión a la base de datos

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Endpoints para gestionar las categorías de libros
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     description: Retorna una lista de todas las categorías almacenadas en la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   NombreCategoria:
 *                     type: string
 *                     example: Ciencia Ficción
 *       500:
 *         description: Error en el servidor
 */
const getcategorias = async (req, res) => {
    try {
        const [categorias] = await db.query('SELECT * FROM categorias');
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     description: Agrega una nueva categoría a la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NombreCategoria:
 *                 type: string
 *                 example: Fantasía
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 NombreCategoria:
 *                   type: string
 *                   example: Fantasía
 *       500:
 *         description: Error en el servidor
 */
const createCategoria = async (req, res) => {
    const { NombreCategoria } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO categorias (NombreCategoria) VALUES (?)',
            [NombreCategoria]
        );

        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
 *     description: Modifica una categoría existente en la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NombreCategoria:
 *                 type: string
 *                 example: Misterio
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 NombreCategoria:
 *                   type: string
 *                   example: Misterio
 *       404:
 *         description: Categoría no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { NombreCategoria } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE categorias SET NombreCategoria = ? WHERE CategoriaID= ?',
            [NombreCategoria, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ id, NombreCategoria });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categorías]
 *     description: Elimina una categoría de la base de datos por su ID.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a eliminar.
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente.
 *       404:
 *         description: Categoría no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
const deleteCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM categorias WHERE CategoriaID = ?', [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categorías]
 *     description: Retorna la categoría almacenada en la base de datos correspondiente al ID proporcionado.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría que se desea obtener.
 *     responses:
 *       200:
 *         description: Categoría obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 NombreCategoria:
 *                   type: string
 *                   example: Ciencia Ficción
 *       404:
 *         description: Categoría no encontrada.
 *       500:
 *         description: Error en el servidor
 */
const getCategoriaById = async (req, res) => {
    const { id } = req.params;

    try {
        const [categoria] = await db.query('SELECT * FROM categorias WHERE CategoriaID = ?', [id]);

        if (categoria.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json(categoria[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = { getcategorias, createCategoria, updateCategoria, deleteCategoria, getCategoriaById };
