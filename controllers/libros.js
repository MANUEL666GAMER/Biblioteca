const db = require('../config/db');

const getLibros = async (req, res) => {
    try {
        const [libros] = await db.query('SELECT * FROM Libros');
        res.json(libros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

module.exports = { getLibros, createLibro, updateLibro };



module.exports = { getLibros, createLibro,updateLibro };