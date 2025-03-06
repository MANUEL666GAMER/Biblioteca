const db = require('../config/db'); // Importa la conexión a la base de datos

// Obtener todos los libros
const getLibros = async (req, res) => {
    try {
        // Ejecuta la consulta para obtener todos los libros de la base de datos
        const [libros] = await db.query('SELECT * FROM Libros');
        res.json(libros); // Devuelve el resultado en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Crear un nuevo libro
const createLibro = async (req, res) => {
    // Extrae los datos del libro desde el cuerpo de la solicitud
    const { Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado } = req.body;
    
    try {
        // Inserta un nuevo libro en la base de datos
        const [result] = await db.query(
            'INSERT INTO Libros (Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado]
        );
        
        // Devuelve una respuesta con el ID del nuevo libro creado
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Actualizar un libro existente
const updateLibro = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del libro desde los parámetros de la URL
    const { Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado } = req.body; // Obtiene los nuevos datos del libro

    try {
        // Ejecuta la consulta para actualizar los datos del libro en la base de datos
        const [result] = await db.query(
            'UPDATE Libros SET Titulo = ?, Autor = ?, ISBN = ?, Editorial = ?, AnioPublicacion = ?, CategoriaID = ?, Estado = ? WHERE id = ?',
            [Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado, id]
        );

        // Verifica si el libro fue encontrado y actualizado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        // Responde con los datos actualizados del libro
        res.json({ id, Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Eliminar un libro
const deleteLibro = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del libro desde los parámetros de la URL

    try {
        // Ejecuta la consulta para eliminar el libro de la base de datos
        const [result] = await db.query(
            'DELETE FROM Libros WHERE id = ?',
            [id]
        );

        // Verifica si el libro fue encontrado y eliminado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        // Responde con un mensaje de éxito
        res.status(200).json({ message: 'Libro eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Exporta las funciones para que puedan ser utilizadas en las rutas
module.exports = { getLibros, createLibro, updateLibro, deleteLibro };
