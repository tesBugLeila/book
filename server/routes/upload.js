const express = require('express');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const admin = require('firebase-admin');

const app = express();
const bucket = admin.storage().bucket(); 

// Настройка multer для загрузки файлов
const upload = multer({
  storage: multer.memoryStorage(), 
});

// Маршрут для загрузки изображений (только для администратора)
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Файл не загружен' });
  }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on('error', (err) => {
    res.status(500).json({ message: 'Ошибка при загрузке файла', error: err.message });
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
    res.status(200).json({ imageUrl: publicUrl });
  });

  blobStream.end(req.file.buffer);
});



