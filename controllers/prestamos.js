const db = require('../config/db'); // Importa la conexión a la base de datos

// Obtener todos los préstamos
const getPrestamos = async (req, res) => {
    try {
        // Ejecuta la consulta para obtener todos los préstamos de la base de datos
        const [prestamos] = await db.query('SELECT * FROM Prestamos');
        res.json(prestamos); // Devuelve el resultado en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Crear un nuevo préstamo
const createPrestamo = async (req, res) => {
    // Extrae los datos del préstamo desde el cuerpo de la solicitud
    const { UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo } = req.body;
    
    try {
        // Inserta un nuevo préstamo en la base de datos
        const [result] = await db.query(
            'INSERT INTO Prestamos (UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo) VALUES (?, ?, ?, ?, ?)',
            [UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo]
        );
        
        // Devuelve una respuesta con el ID del nuevo préstamo creado
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Actualizar un préstamo existente
const updatePrestamo = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del préstamo desde los parámetros de la URL
    const { UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo } = req.body; // Obtiene los nuevos datos del préstamo

    try {
        // Ejecuta la consulta para actualizar los datos del préstamo en la base de datos
        const [result] = await db.query(
            'UPDATE Prestamos SET UsuarioID = ?, LibroID = ?, FechaPrestamo = ?, FechaDevolucion = ?, EstadoPrestamo = ? WHERE id = ?',
            [UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo, id]
        );

        // Verifica si el préstamo fue encontrado y actualizado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        // Responde con los datos actualizados del préstamo
        res.json({ id, UsuarioID, LibroID, FechaPrestamo, FechaDevolucion, EstadoPrestamo });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Eliminar un préstamo
const deletePrestamo = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del préstamo desde los parámetros de la URL

    try {
        // Ejecuta la consulta para eliminar el préstamo de la base de datos
        const [result] = await db.query(
            'DELETE FROM Prestamos WHERE id = ?',
            [id]
        );

        // Verifica si el préstamo fue encontrado y eliminado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        // Responde con un mensaje de éxito
        res.status(200).json({ message: 'Préstamo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Exporta las funciones para que puedan ser utilizadas en las rutas
module.exports = { getPrestamos, createPrestamo, updatePrestamo, deletePrestamo };
