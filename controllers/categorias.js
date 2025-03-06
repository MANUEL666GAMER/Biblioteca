const db = require('../config/db'); // Importa la conexión a la base de datos

// Obtener todas las categorías
const getCategorias = async (req, res) => {
    try {
        // Ejecuta la consulta para obtener todas las categorías
        const [categorias] = await db.query('SELECT * FROM Categorias');
        res.json(categorias); // Devuelve el resultado en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
    const { NombreCategoria } = req.body; // Obtiene el nombre de la categoría del cuerpo de la solicitud

    try {
        // Inserta la nueva categoría en la base de datos
        const [result] = await db.query(
            'INSERT INTO Categorias (NombreCategoria) VALUES (?)',
            [NombreCategoria]
        );

        // Devuelve una respuesta con el ID de la nueva categoría
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Actualizar una categoría existente
const updateCategoria = async (req, res) => {
    const { id } = req.params; // Obtiene el ID de la categoría desde los parámetros de la URL
    const { NombreCategoria } = req.body; // Obtiene el nuevo nombre de la categoría

    try {
        // Ejecuta la consulta para actualizar la categoría
        const [result] = await db.query(
            'UPDATE Categorias SET NombreCategoria = ? WHERE id = ?',
            [NombreCategoria, id]
        );

        // Verifica si se actualizó alguna fila
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Responde con la categoría actualizada
        res.json({ id, NombreCategoria });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
    const { id } = req.params; // Obtiene el ID de la categoría desde los parámetros de la URL

    try {
        // Ejecuta la consulta para eliminar la categoría
        const [result] = await db.query(
            'DELETE FROM Categorias WHERE id = ?',
            [id]
        );

        // Verifica si se eliminó alguna fila
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Responde con un mensaje de éxito
        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Exporta las funciones para que puedan ser utilizadas en las rutas
module.exports = { getCategorias, createCategoria, updateCategoria, deleteCategoria };
