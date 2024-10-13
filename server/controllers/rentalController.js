const Rental = require('../models/rentalModel');
const moment = require('moment');
const Book = require('../models/bookModel');
const User = require('../models/userModel'); // Импортируем модель User

exports.createRental = async (req, res) => {
  try {
    const { bookId, rentalDuration } = req.body;
    const userId = req.userId;

    if (!bookId || !rentalDuration) {
      return res.status(400).json({ message: 'Поля bookId и rentalDuration обязательны' });
    }

    const book = await Book.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    if (book.status !== 'available') {
      return res.status(400).json({ message: 'Книга недоступна для аренды' });
    }

    const existingRental = await Rental.findOne({ 
      bookId, 
      userId 
    });

    if (existingRental) {
      return res.status(400).json({ 
        message: 'Эта книга уже арендована вами. Вы не можете арендовать её повторно, пока аренда активна.' 
      });
    }

    const rentalEndDate = moment().add(rentalDuration, 'months').toISOString();
    const newRental = await Rental.create({
      bookId,
      userId,
      rentalStartDate: new Date().toISOString(),
      rentalEndDate,
      status: 'active',
    });

    await Book.updateStatus(bookId, 'rented');

    res.status(201).json({ message: 'Книга арендована успешно', rental: newRental });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при аренде книги', error: error.message });
  }
};

// Получение всех аренд (только для администратора)
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.getAllRentals(); 
    if (rentals.length === 0) {
      return res.status(404).json({ message: 'Аренды не найдены' });
    }

    const bookIds = [...new Set(rentals.map(rental => rental.bookId))];
    const userIds = [...new Set(rentals.map(rental => rental.userId))];

   
    const books = await Book.getBooksByIds(bookIds);
    const booksMap = books.reduce((map, book) => {
      map[book.id] = book.title;
      return map;
    }, {});

   
    const users = await User.getUsersByIds(userIds);
    const usersMap = users.reduce((map, user) => {
      map[user.id] = user.email;
      return map;
    }, {});

   
    const rentalsWithDetails = rentals.map(rental => ({
      ...rental,
      bookTitle: booksMap[rental.bookId] || 'Заголовок не найден',
      userEmail: usersMap[rental.userId] || 'Email не найден',
    }));

    res.json(rentalsWithDetails); 
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении аренд', error: error.message });
  }
};

// Получение аренд пользователя по его ID
exports.getRentalsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.userId;
    const userRole = req.userRole;

    if (userId !== requestingUserId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для просмотра аренд этого пользователя' });
    }

    const rentals = await Rental.getUserRentals(userId);
    if (rentals.length === 0) {
      return res.status(404).json({ message: 'Аренды не найдены' });
    }

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении аренд', error: error.message });
  }
};

// Получение аренды по ID (для всех авторизованных пользователей)
exports.getRentalById = async (req, res) => {
  try {
    const { rentalId } = req.params;
    const rental = await Rental.getById(rentalId);

    if (!rental) {
      return res.status(404).json({ message: 'Аренда не найдена' });
    }

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении аренды', error: error.message });
  }
};

// Возврат книги
exports.returnBook = async (req, res) => {
  try {
    const { rentalId } = req.params;
    const userId = req.userId;

    const rental = await Rental.getById(rentalId);
    if (!rental) {
      return res.status(404).json({ message: 'Аренда не найдена' });
    }

    
    const isAdmin = req.userRole === 'admin';

   
    if (!isAdmin && rental.userId !== userId) {
      return res.status(403).json({ message: 'Нет прав для возврата этой книги' });
    }

  
    await Rental.delete(rentalId);

    
    await Book.updateStatus(rental.bookId, 'available');

    res.status(200).json({ message: 'Книга успешно возвращена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при возврате книги', error: error.message });
  }
};
