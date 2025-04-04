const db = require('../config/db'); // Importa la conexión a la base de datos

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar los usuarios en la biblioteca
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     description: Retorna la lista de todos los usuarios en la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       500:
 *         description: Error en el servidor
 */
const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     description: Agrega un nuevo usuario a la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Apellido:
 *                 type: string
 *               Email:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Direccion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error en el servidor
 */
const createUsuario = async (req, res) => {
    const { Nombre, Apellido, Email, Telefono, Direccion } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO usuarios (Nombre, Apellido, Email, Telefono, Direccion) VALUES (?, ?, ?, ?, ?)',
            [Nombre, Apellido, Email, Telefono, Direccion]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios] 
 *     description: Modifica un usuario existente en la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Apellido:
 *                 type: string
 *               Email:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { Nombre, Apellido, Email, Telefono, Direccion } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE usuarios SET Nombre = ?, Apellido = ?, Email = ?, Telefono = ?, Direccion = ? WHERE UsuarioID = ?',
            [Nombre, Apellido, Email, Telefono, Direccion, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ id, Nombre, Apellido, Email, Telefono, Direccion });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     description: Borra un usuario de la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM usuarios WHERE `usuarios`.`UsuarioID` = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     description: Retorna los detalles de un usuario específico de la base de datos, utilizando el ID del usuario.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
const getUsuarioById = async (req, res) => {
    const { id } = req.params;

    try {
        const [usuario] = await db.query('SELECT * FROM usuarios WHERE UsuarioID = ?', [id]);

        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsuarios, createUsuario, updateUsuario, deleteUsuario, getUsuarioById };
