const db = require('../config/db');

// Obtener todos los libros
const getLibros = async (req, res) => {
    try {
        const [libros] = await db.query('SELECT * FROM Libros');
        res.json(libros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un libro
const createLibro = async (req, res) => {
    const { Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Libros (Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un libro
const updateLibro = async (req, res) => {
    const { id } = req.params;
    const { Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE Libros SET Titulo = ?, Autor = ?, ISBN = ?, Editorial = ?, AnioPublicacion = ?, CategoriaID = ?, Estado = ? WHERE id = ?',
            [Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        res.json({ id, Titulo, Autor, ISBN, Editorial, AnioPublicacion, CategoriaID, Estado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un libro
const deleteLibro = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM Libros WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        res.status(200).json({ message: 'Libro eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLibros, createLibro, updateLibro, deleteLibro };
