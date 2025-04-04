const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta de destino para las imágenes
const uploadPath = path.join(__dirname, '../uploads');

// Verificar si la carpeta 'uploads' existe, si no, crearla
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Usar la carpeta uploads para almacenar las imágenes
    },
    filename: (req, file, cb) => {
        // Renombrar el archivo con un timestamp y su extensión original
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filtro para asegurarse de que solo se suban imágenes en formatos específicos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        return cb(new Error('Solo se permiten imágenes en formato JPG, JPEG o PNG'), false);
    }
};

// Configuración de Multer con almacenamiento y filtros
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Límite de tamaño de archivo de 2MB
});

module.exports = upload;
