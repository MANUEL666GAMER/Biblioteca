require('dotenv').config(); // Cargar variables de entorno
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para la autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     description: Autentica un usuario y devuelve un token JWT.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar la conexión a la base de datos
        const connection = await db.getConnection();
        if (!connection) {
            console.error("⚠ Error: No se pudo obtener una conexión");
            return res.status(500).json({ message: "Error en la conexión a la base de datos" });
        }

        console.log("✅ Conexión a la base de datos establecida");

        const query = "SELECT * FROM tbl_usuarios WHERE email = ?";
        const [results] = await connection.query(query, [email]);

        connection.release(); // Liberar la conexión

        if (results.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar el token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });

    } catch (error) {
        console.error("❌ Error en /login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = router;