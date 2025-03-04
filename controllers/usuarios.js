const db = require('../config/db');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await db.query('SELECT * FROM Usuarios');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un usuario
const createUsuario = async (req, res) => {
    const { Nombre, Apellido, Email, Telefono, Direccion } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, Direccion) VALUES (?, ?, ?, ?, ?)',
            [Nombre, Apellido, Email, Telefono, Direccion]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { Nombre, Apellido, Email, Telefono, Direccion } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE Usuarios SET Nombre = ?, Apellido = ?, Email = ?, Telefono = ?, Direccion = ? WHERE id = ?',
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

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM Usuarios WHERE id = ?',
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

module.exports = { getUsuarios, createUsuario, updateUsuario, deleteUsuario };
