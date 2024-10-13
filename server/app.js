const express = require('express');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path'); 
const cors = require('cors');

dotenv.config();


if (!process.env.JWT_SECRET) {
  console.error('Необходимо задать JWT_SECRET в .env файле.');
  process.exit(1);
}

// Инициализация Firebase через файл serviceAccountKey.json
const serviceAccount = require(path.resolve(__dirname, './serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "book-5d1a9.appspot.com"
});


const db = admin.firestore();
db.collection('test').get()
  .then(() => {
    console.log('Успешно подключено к базе данных Firestore');
  })
  .catch((error) => {
    console.error('Ошибка подключения к базе данных:', error);
  });

const app = express();
app.use(express.json()); 

app.use(cors());


// Подключение роутов
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/purchases', purchaseRoutes);

// Запуск крон-задачи
const startCronJob = require('./notify/cron'); 
startCronJob();  // Запускать крон-задачу после инициализации Firebase!!!а иначе не работает

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
