const db = require('../config/db'); // Importa la conexión a la base de datos
const { get } = require('../routes/api');

/**
 * @swagger
 * tags:
 *   name: Préstamos
 *   description: Endpoints para gestionar los prestamos de libros  
 */

/**
 * @swagger
 * /prestamos:
 *   get:
 *     summary: Obtener todos los préstamos
 *     tags: [Préstamos]
 *     description: Retorna la lista de todos los préstamos en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de préstamos obtenida exitosamente
 *         security: [{ bearerAuth: [] }]
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   UsuarioID:
 *                     type: integer
 *                   LibroID:
 *                     type: integer
 *                   FechaPrestamo:
 *                     type: string
 *                     format: date
 *                   FechaDevolucion:
 *                     type: string
 *                     format: date
 *                   EstadoPrestamo:
 *                     type: string
 *             example:
 *               - id: 1
 *                 UsuarioID: 3
 *                 LibroID: 5
 *                 FechaPrestamo: "2025-02-15"
 *                 FechaDevolucion: "2025-03-15"
 *                 EstadoPrestamo: "Pendiente"
 *               - id: 2
 *                 UsuarioID: 2
 *                 LibroID: 8
 *                 FechaPrestamo: "2025-02-10"
 *                 FechaDevolucion: "2025-02-20"
 *                 EstadoPrestamo: "Devuelto"
 *       500:
 *         description: Error en el servidor
 */
const getPrestamos = async (req, res) => {
    try {
        const [prestamos] = await db.query('SELECT * FROM prestamos');
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /prestamos:
 *   post:
 *     summary: Crear un nuevo préstamo
 *     tags: [Préstamos]
 *     description: Agrega un nuevo préstamo a la base de datos.
 *     security: [{ bearerAuth: [] }]  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UsuarioID:
 *                 type: integer
 *               LibroID:
 *                 type: integer
 *               FechaPrestamo:
 *                 type: string
 *                 format: date
 *               FechaDevolucion:
 *                 type: string
 *                 format: date
 *               EstadoPrestamo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Préstamo creado exitosamente
 *       500:
 *         description: Error en el servidor
 */
const createPrestamo = async (req, res) => {
    const { UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo } = req.body;

    // Validar que la fecha de devolución sea mayor que la fecha de préstamo
    if (new Date(FechaDevolucion) <= new Date(FechaPrestamo)) {
        return res.status(400).json({ message: "La Fecha de Devolución debe ser mayor que la Fecha de Préstamo." });
    }

    try {
        // Verificar si el libro ya está prestado y no ha sido devuelto
        const [libroPrestado] = await db.query(
            'SELECT 1 FROM prestamos WHERE LibroID = ? AND EstadoPrestamo = ? LIMIT 1',
            [LibroID, "Pendiente"]
        );
        
        if (libroPrestado.length > 0) {
            return res.status(400).json({ message: "El libro ya está prestado y no puede ser prestado a otra persona." });
        }
        

        // Si el libro no está prestado, proceder con el préstamo
        const [result] = await db.query(
            'INSERT INTO prestamos (UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo) VALUES (?, ?, ?, ?, ?)',
            [UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo]
        );

        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /prestamos/{id}:
 *   put:
 *     summary: Actualizar un préstamo
 *     tags: [Préstamos]
 *     description: Modifica un préstamo existente en la base de datos.
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
 *               UsuarioID:
 *                 type: integer
 *               LibroID:
 *                 type: integer
 *               FechaPrestamo:
 *                 type: string
 *                 format: date
 *               FechaDevolucion:
 *                 type: string
 *                 format: date
 *               EstadoPrestamo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Préstamo actualizado exitosamente
 *       404:
 *         description: Préstamo no encontrado
 *       500:
 *         description: Error en el servidor
 */
const updatePrestamo = async (req, res) => {
    const { id } = req.params;
    const { UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo } = req.body;

    if (!UsuarioID || !LibroID || !FechaPrestamo || !FechaDevolucion || !EstadoPrestamo) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar que la fecha de devolución sea mayor que la fecha de préstamo
    if (new Date(FechaDevolucion) <= new Date(FechaPrestamo)) {
        return res.status(400).json({ message: "La Fecha de Devolución debe ser mayor que la Fecha de Préstamo." });
    }

    try {
        const [result] = await db.query(
            'UPDATE prestamos SET UsuarioID = ?, LibroID = ?, FechaPrestamo = ?, FechaDevolucion = ?, EstadoPrestamo = ? WHERE PrestamoID = ?',
            [UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        res.json({ id, UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo });
    } catch (error) {
        res.status(500).json({ message: "Ocurrió un error al actualizar el préstamo" });
    }
};


/**
 * @swagger
 * /prestamos/{id}:
 *   delete:
 *     summary: Eliminar un préstamo
 *     tags: [Préstamos]
 *     description: Borra un préstamo de la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Préstamo eliminado exitosamente
 *       404:
 *         description: Préstamo no encontrado
 *       500:
 *         description: Error en el servidor
 */
const deletePrestamo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM prestamos WHERE `prestamos`.`PrestamoID` = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        res.status(200).json({ message: 'Préstamo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /prestamos/{id}:
 *   get:
 *     summary: Obtener un préstamo por ID
 *     tags: [Préstamos]
 *     description: Retorna un préstamo específico basado en su ID.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Préstamo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 UsuarioID:
 *                   type: integer
 *                 LibroID:
 *                   type: integer
 *                 FechaPrestamo:
 *                   type: string
 *                   format: date
 *                 FechaDevolucion:
 *                   type: string
 *                   format: date
 *                 EstadoPrestamo:
 *                   type: string
 *       404:
 *         description: Préstamo no encontrado
 *       500:
 *         description: Error en el servidor
 */
const getPrestamoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [prestamo] = await db.query('SELECT * FROM prestamos WHERE PrestamoID = ?', [id]);
        if (prestamo.length === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        res.json(prestamo[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /prestamos/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener los préstamos de un usuario
 *     tags: [Préstamos]
 *     description: Retorna la lista de todos los préstamos de un usuario específico.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de préstamos del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   UsuarioID:
 *                     type: integer
 *                   LibroID:
 *                     type: integer
 *                   FechaPrestamo:
 *                     type: string
 *                     format: date
 *                   FechaDevolucion:
 *                     type: string
 *                     format: date
 *                   EstadoPrestamo:
 *                     type: string
 *             example:
 *               - id: 1
 *                 UsuarioID: 3
 *                 LibroID: 5
 *                 FechaPrestamo: "2025-02-15"
 *                 FechaDevolucion: "2025-03-15"
 *                 EstadoPrestamo: "Pendiente"
 *       404:
 *         description: No se encontraron préstamos para el usuario
 *       500:
 *         description: Error en el servidor
 */
const getPrestamosByUsuario = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const [prestamos] = await db.query('SELECT * FROM prestamos WHERE UsuarioID = ?', [usuarioId]);
        if (prestamos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron préstamos para el usuario' });
        }
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /prestamos/libro/{libroId}:
 *   get:
 *     summary: Obtener los préstamos de un libro
 *     tags: [Préstamos]
 *     description: Retorna la lista de todos los préstamos de un libro específico.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: libroId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de préstamos del libro obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   UsuarioID:
 *                     type: integer
 *                   LibroID:
 *                     type: integer
 *                   FechaPrestamo:
 *                     type: string
 *                     format: date
 *                   FechaDevolucion:
 *                     type: string
 *                     format: date
 *                   EstadoPrestamo:
 *                     type: string
 *             example:
 *               - id: 1
 *                 UsuarioID: 3
 *                 LibroID: 5
 *                 FechaPrestamo: "2025-02-15"
 *                 FechaDevolucion: "2025-03-15"
 *                 EstadoPrestamo: "Pendiente"
 *       404:
 *         description: No se encontraron préstamos para el libro
 *       500:
 *         description: Error en el servidor
 */
const getPrestamosByLibro = async (req, res) => {
    const { libroId } = req.params;
    try {
        const [prestamos] = await db.query('SELECT * FROM prestamos WHERE LibroID = ?', [libroId]);
        if (prestamos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron préstamos para el libro' });
        }
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getPrestamos, 
    createPrestamo, 
    updatePrestamo, 
    deletePrestamo, 
    getPrestamoById, 
    getPrestamosByUsuario,
    getPrestamosByLibro 
};