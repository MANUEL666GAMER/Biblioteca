const db = require('../config/db'); // Importa la conexión a la base de datos

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        // Consulta a la base de datos para obtener todos los usuarios
        const [usuarios] = await db.query('SELECT * FROM Usuarios');
        res.json(usuarios); // Responde con los datos en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Crear un usuario
const createUsuario = async (req, res) => {
    // Extrae los datos del usuario desde el cuerpo de la solicitud
    const { Nombre, Apellido, Email, Telefono, Direccion } = req.body;

    try {
        // Inserta un nuevo usuario en la base de datos
        const [result] = await db.query(
            'INSERT INTO Usuarios (Nombre, Apellido, Email, Telefono, Direccion) VALUES (?, ?, ?, ?, ?)',
            [Nombre, Apellido, Email, Telefono, Direccion]
        );

        // Devuelve la respuesta con el ID del nuevo usuario creado
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del usuario desde los parámetros de la URL
    const { Nombre, Apellido, Email, Telefono, Direccion } = req.body; // Obtiene los nuevos datos del usuario

    try {
        // Actualiza los datos del usuario en la base de datos
        const [result] = await db.query(
            'UPDATE Usuarios SET Nombre = ?, Apellido = ?, Email = ?, Telefono = ?, Direccion = ? WHERE id = ?',
            [Nombre, Apellido, Email, Telefono, Direccion, id]
        );

        // Verifica si el usuario fue encontrado y actualizado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devuelve la respuesta con los datos actualizados del usuario
        res.json({ id, Nombre, Apellido, Email, Telefono, Direccion });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del usuario desde los parámetros de la URL

    try {
        // Ejecuta la consulta para eliminar el usuario de la base de datos
        const [result] = await db.query(
            'DELETE FROM Usuarios WHERE id = ?',
            [id]
        );

        // Verifica si el usuario fue encontrado y eliminado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devuelve la respuesta confirmando la eliminación del usuario
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Exporta las funciones para su uso en las rutas
module.exports = { getUsuarios, createUsuario, updateUsuario, deleteUsuario };
