const cron = require('node-cron');
const Rental = require('../models/rentalModel'); 
const User = require('../models/userModel');
const Book = require('../models/bookModel'); 
const sendEmail = require('./mailer'); 




const startCronJob = () => {
  cron.schedule('*/30 * * * *', async () => {  
    console.log('Крон-задача запущена...');

    try {
      const rentals = await Rental.getAllRentals(); // Получаем все аренды
      console.log('Аренды:', rentals);

      rentals.forEach(async (rental) => {
        const endDate = new Date(rental.rentalEndDate);
        const today = new Date();

        // Проверка, если аренда активна и скоро закончится
        if (rental.status === 'active' && endDate >= today) {
          const reminderThreshold = new Date(today);
          reminderThreshold.setDate(today.getDate() + 7); // Напоминание за 7 дней до окончания аренды

          if (endDate <= reminderThreshold && !rental.reminderSent) {
            console.log(`Отправка напоминания для аренды: ${rental.id}`);
            await sendReminder(rental.userId, rental.bookId);

            // Обновляем аренду, чтобы отметить, что напоминание отправлено
            await Rental.update(rental.id, {
              reminderSent: true,
              reminderDate: new Date(),
            });
          }
        }
      });
    } catch (error) {
      console.error('Ошибка при получении аренд:', error.message);
    }
  });
};

// Функция для отправки напоминания
const sendReminder = async (userId, bookId) => {
  try {
    const user = await User.getById(userId);
    const book = await Book.getById(bookId);

    if (!user || !book) {
      console.log('Пользователь или книга не найдены:', userId, bookId);
      return;
    }

    const subject = 'Напоминание о завершении аренды';
    const text = `Ваша аренда книги "${book.title}" скоро закончится.`;

    await sendEmail(user.email, subject, text); // Отправляем email
  } catch (error) {
    console.error('Ошибка при отправке напоминания:', error.message);
  }
};

module.exports = startCronJob;
