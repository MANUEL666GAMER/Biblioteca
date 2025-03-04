const db = require('../config/db');

// Obtener todos los préstamos
const getPrestamos = async (req, res) => {
    try {
        const [prestamos] = await db.query('SELECT * FROM Prestamos');
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un préstamo
const createPrestamo = async (req, res) => {
    const { UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Prestamos (UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo) VALUES (?, ?, ?, ?, ?)',
            [UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un préstamo
const updatePrestamo = async (req, res) => {
    const { id } = req.params;
    const { UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE Prestamos SET UsuarioID = ?, LibroID = ?, FechaPrestamo = ?, FechaDevolucion = ?, EstadoPrestamo = ? WHERE id = ?',
            [UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        res.json({ id, UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un préstamo
const deletePrestamo = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM Prestamos WHERE id = ?',
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

module.exports = { getPrestamos, createPrestamo, updatePrestamo, deletePrestamo };
