const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');

// Initialize GridFS Storage
const storage = new GridFsStorage({
    url: process.env.DB, // MongoDB connection string
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ['image/png', 'image/jpeg'];

        if (match.indexOf(file.mimetype) === -1) {
            return null; // Reject the file
        }

        return {
            bucketName: 'photos', // Name of the GridFS bucket
            filename: `${Date.now()}-${file.originalname}`, // Filename for the uploaded file
        };
    },
});

// Create Multer instance with GridFS storage
const upload = multer({ storage });

module.exports = upload;
