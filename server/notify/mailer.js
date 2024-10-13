const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru', 
    port: 587, 
    secure: false, 
    auth: {
      user: 'qtest9a@yandex.ru', // МОЙ email
      pass: 'waoiekoeyxglyeyd', //МОЙ пароль 
    },
  });




// Функция для отправки email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'qtest9a@yandex.ru',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Письмо отправлено на ${to}`);
  } catch (error) {
    console.error('Ошибка при отправке письма:', error.message);
  }
};

module.exports = sendEmail;
