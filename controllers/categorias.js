const db = require('../config/db');

const getCategorias = async (req, res) => {
    try {
        const [categorias] = await db.query('SELECT * FROM Categorias');
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una categoría
const createCategoria = async (req, res) => {
    const { NombreCategoria } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Categorias (NombreCategoria) VALUES (?)',
            [NombreCategoria]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

// Actualizar una categoría
const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { NombreCategoria } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE Categorias SET NombreCategoria = ? WHERE id = ?',
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



module.exports = { getCategorias, createCategoria,updateCategoria };