const Book = require('../models/bookModel');
const admin = require('firebase-admin');
const bucket = admin.storage().bucket();


// Получение всех книг (доступно всем)
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении книг', error: error.message });
  }
};


// Получение книги по ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении книги', error: error.message });
  }
};


// Создание новой книги (только для администратора)
exports.createBook = async (req, res) => {
  try {
 
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Только администратор может добавлять книги' });
    }

    let imageUrl = null;
    if (req.file) {
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

 
      await new Promise((resolve, reject) => {
        blobStream.on('finish', () => {
          imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
          resolve();
        });

        blobStream.on('error', (error) => {
          reject(error);
        });

        blobStream.end(req.file.buffer);
      });
    }

    
    const bookData = {
      title: req.body.title,
      author: req.body.author,
      year: parseInt(req.body.year) || null, 
      price: parseFloat(req.body.price) || null,
      category: req.body.category || 'Без категории', 
      rating: parseFloat(req.body.rating) || null, 
      status: req.body.status || 'available',
      imageUrl: imageUrl, 
    };


    const newBook = await Book.create(bookData);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Ошибка при создании книги:", error); 
    res.status(500).json({ message: 'Ошибка при создании книги', error: error.message });
  }
};

// Обновление книги (только для администратора)
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const bookData = req.body;

  
    if (req.file) {
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

   
      await new Promise((resolve, reject) => {
        blobStream.on('finish', () => {
          bookData.imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
          resolve();
        });

        blobStream.on('error', (error) => {
          reject(error);
        });

        blobStream.end(req.file.buffer);
      });
    }

    const updatedBook = await Book.update(bookId, bookData);
    res.json({ message: 'Книга успешно обновлена', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении книги', error: error.message });
  }
};


// Удаление книги (только для администратора)
exports.deleteBook = async (req, res) => {
  try {
    await Book.delete(req.params.id);
    res.json({ message: 'Книга успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении книги', error: error.message });
  }
};

