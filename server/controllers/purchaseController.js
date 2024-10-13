const Purchase = require('../models/purchaseModel');
const Book = require('../models/bookModel');

// Создание новой покупки
exports.createPurchase = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userId;

    if (!bookId) {
      return res.status(400).json({ message: 'Поле bookId обязательно' });
    }

    const book = await Book.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }


    if (book.status !== 'available' && book.status !== 'reserved') {
      return res.status(400).json({ message: 'Книга недоступна для покупки' });
    }


    const purchase = await Purchase.create({ userId, bookId, purchaseDate: new Date().toISOString() });


    await Book.updateStatus(bookId, 'sold');

    res.status(201).json({ message: 'Книга куплена успешно', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при покупке книги', error: error.message });
  }
};


// Получение покупок пользователя по его ID
exports.getPurchasesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const purchases = await Purchase.getByUserId(userId);
    if (purchases.length === 0) {
      return res.status(404).json({ message: 'Покупки не найдены' });
    }
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении покупок', error: error.message });
  }
};



// Получение всех покупок (для администраторов)
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.getAll();


    const purchasesWithDetails = await Promise.all(
      purchases.map(async (purchase) => {
      
        const book = await Book.getById(purchase.bookId);
        return {
          ...purchase,
          bookTitle: book ? book.title : 'Неизвестная книга',
        };
      })
    );

    res.json(purchasesWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении покупок', error: error.message });
  }
};

// Создание массовой покупки
exports.createBulkPurchase = async (req, res) => {
  try {
    const { bookIds } = req.body;
    const userId = req.userId;

    if (!bookIds || bookIds.length === 0) {
      return res.status(400).json({ message: 'Не выбраны книги для покупки' });
    }

    const books = await Book.getBooksByIds(bookIds);

    const unavailableBooks = books.filter(book => book.status !== 'available' && book.status !== 'reserved');
    if (unavailableBooks.length > 0) {
      return res.status(400).json({ message: 'Некоторые книги недоступны для покупки', unavailableBooks });
    }

    const purchases = [];
    for (let book of books) {
      const purchase = await Purchase.create({ userId, bookId: book.id, purchaseDate: new Date().toISOString() });
      purchases.push(purchase);

  
      await Book.updateStatus(book.id, 'sold');
    }


    await Cart.removeBooksFromCart(userId, bookIds);

    res.status(201).json({ message: 'Покупка завершена успешно', purchases });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при массовой покупке книг', error: error.message });
  }
};
