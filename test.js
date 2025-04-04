const db = require('./config/db');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT NOW() AS time');
        console.log('✅ Conectado a AWS RDS:', rows);
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
}

testConnection();
