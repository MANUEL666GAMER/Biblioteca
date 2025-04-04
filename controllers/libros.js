const upload = require('../config/multerConfig'); // Importa el middleware de carga de archivos
const db = require('../config/db'); // Importa la conexión a la base de datos

/**
 * @swagger
 * tags:
 *   name: libros
 *   description: Endpoints para gestionar los libros en la biblioteca
 */ 

/**
 * @swagger
 * /libros:
 *   get:
 *     summary: Obtener todos los libros
 *     tags: [libros]
 *     description: Retorna una lista de todos los libros almacenados en la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de libros obtenida correctamente.
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
 *                   Titulo:
 *                     type: string
 *                     example: "El Principito"
 *                   Autor:
 *                     type: string
 *                     example: "Antoine de Saint-Exupéry"
 */
const getlibros = async (req, res) => {
    try {
        const [libros] = await db.query('SELECT * FROM libros');
        res.json(libros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los libros', error: error.message });
    }
};

/**
 * @swagger
 * /libros:
 *   post:
 *     summary: Crear un nuevo libro
 *     tags: [libros]
 *     description: Agrega un nuevo libro a la base de datos.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Titulo:
 *                 type: string
 *                 example: "Cien años de soledad"
 *               Autor:
 *                 type: string
 *                 example: "Gabriel García Márquez"
 *     responses:
 *       201:
 *         description: Libro creado exitosamente.
 */
const createLibro = async (req, res) => {
    const { Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado } = req.body;
    const imagen = req.file ? `../uploads/${req.file.filename}` : null;

    if (!Titulo || !Autor || !ISBN || !Editorial || !AnioPublicacion || !CategoriaID || !Estado || !imagen) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios, incluyendo la imagen' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO libros (Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado, Imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado, imagen]
        );
        res.status(201).json({ id: result.insertId, Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado, imagen });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el libro', error: error.message });
    }
};




/**
 * @swagger
 * /libros/{id}:
 *   put:
 *     summary: Actualizar un libro existente
 *     tags: [libros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del libro a actualizar.
 *         security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Titulo:
 *                 type: string
 *                 example: "Don Quijote de la Mancha"
 *               Autor:
 *                 type: string
 *                 example: "Miguel de Cervantes"
 *     responses:
 *       200:
 *         description: Libro actualizado correctamente.
 */
const updateLibro = async (req, res) => {
    const { id } = req.params;
    const { Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado } = req.body;
    const imagen = req.file ? `../uploads/${req.file.filename}` : null; // Nueva imagen si se proporciona

    try {
        // Buscar libro existente
        const [existingBook] = await db.query("SELECT * FROM libros WHERE LibroID = ?", [id]);
        if (existingBook.length === 0) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        // Si no se proporciona una nueva imagen, mantener la imagen actual
        const newImagen = imagen ? imagen : existingBook[0].Imagen;

        const fieldsToUpdate = {};
        if (Titulo) fieldsToUpdate.Titulo = Titulo;
        if (Autor) fieldsToUpdate.Autor = Autor;
        if (ISBN) fieldsToUpdate.ISBN = ISBN;
        if (Editorial) fieldsToUpdate.Editorial = Editorial;
        if (AnioPublicacion) fieldsToUpdate.AnioPublicacion = AnioPublicacion;
        if (CategoriaID) fieldsToUpdate.CategoriaID = CategoriaID;
        if (Estado) fieldsToUpdate.Estado = Estado;
        fieldsToUpdate.Imagen = newImagen; // Asigna la nueva imagen (o la anterior)

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: "No se proporcionaron campos para actualizar" });
        }

        // Actualizar libro en la base de datos
        const fields = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.push(id);

        const [result] = await db.query(`UPDATE libros SET ${fields} WHERE LibroID = ?`, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No se pudo actualizar el libro" });
        }

        // Obtener el libro actualizado y devolver la respuesta
        const [updatedBook] = await db.query("SELECT * FROM libros WHERE LibroID = ?", [id]);
        res.json({
            message: "Libro actualizado correctamente",
            libro: updatedBook[0]
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al actualizar el libro",
            error: error.message
        });
    }
};

/**
 * @swagger
 * /libros/{id}:
 *   delete:
 *     summary: Eliminar un libro
 *     tags: [libros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del libro a eliminar.
 *         security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Libro eliminado exitosamente.
 */
const deleteLibro = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM libros WHERE `libros`.`LibroID` = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.status(200).json({ message: 'Libro eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el libro', error: error.message });
    }
};


/**
 * @swagger
 * /libros/{id}:
 *   get:
 *     summary: Obtener un libro por su ID
 *     tags: [libros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del libro a buscar
 *         security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 LibroID:
 *                   type: integer
 *                   example: 1
 *                 Titulo:
 *                   type: string
 *                   example: "El Principito"
 *                 Autor:
 *                   type: string
 *                   example: "Antoine de Saint-Exupéry"
 *       404:
 *         description: Libro no encontrado
 *       500:
 *         description: Error del servidor
 */
const getLibroById = async (req, res) => {
    const { id } = req.params;
    try {
        const [libro] = await db.query('SELECT * FROM libros WHERE LibroID = ?', [id]);
        if (libro.length === 0) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json(libro[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el libro', error: error.message });
    }
};

/**
 * @swagger
 * /libros/categoria/{categoriaId}:
 *   get:
 *     summary: Obtener libros por categoría
 *     tags: [libros]
 *     parameters:
 *       - in: path
 *         name: categoriaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría por la que filtrar
 *         security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de libros de la categoría especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   LibroID:
 *                     type: integer
 *                     example: 1
 *                   Titulo:
 *                     type: string
 *                     example: "El Principito"
 *                   Autor:
 *                     type: string
 *                     example: "Antoine de Saint-Exupéry"
 *                   CategoriaID:
 *                     type: integer
 *                     example: 3
 *       404:
 *         description: No se encontraron libros para la categoría especificada
 *       500:
 *         description: Error del servidor
 */
const getLibrosByCategoria = async (req, res) => {
    const { categoriaId } = req.params;
    try {
        const [libros] = await db.query('SELECT * FROM libros WHERE CategoriaID = ?', [categoriaId]);
        if (libros.length === 0) {
            return res.status(404).json({ message: 'No se encontraron libros para esta categoría' });
        }
        res.json(libros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener libros por categoría', error: error.message });
    }
};

// Las funciones existentes (getlibros, createLibro, updateLibro, deleteLibro) permanecen igual

module.exports = { 
    getlibros, 
    createLibro, 
    updateLibro, 
    deleteLibro,
    getLibroById,
    getLibrosByCategoria
};

