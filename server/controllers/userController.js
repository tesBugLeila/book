const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Регистрация пользователя (доступно всем)
exports.register = async (req, res) => {
  try {
    const { email, password, username, ...otherData } = req.body;


    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Все поля должны быть заполнены' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Пароль должен содержать не менее 6 символов' });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ message: 'Имя пользователя должно быть от 3 до 20 символов' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Некорректный формат email' });
    }


    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }

  
    const newUser = await User.create({ email, password, username, ...otherData });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });



    // Возвращаем информацию о пользователе и токен
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации пользователя', error: error.message });
  }
};

// Вход в систему (доступно всем)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

   
    const user = await User.findByEmail(email);
    if (!user || !(await User.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

   
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    
    res.json({
      message: 'Успешный вход',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при входе в систему', error: error.message });
  }
};

// Получение пользователя по токену
exports.getUserByToken = async (req, res) => {
  try {
    const user = await User.getById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({
      id: user.id,
      email: user.email,
      username: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения пользователя', error: err.message });
  }
};

// Получение всех пользователей (только для администратора)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Только администратор может просматривать всех пользователей' });
    }

    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователей', error: error.message });
  }
};

// Удаление пользователя (только для администратора)
exports.deleteUser = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Только администратор может удалять пользователей' });
    }

    await User.delete(req.params.id);
    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении пользователя', error: error.message });
  }
};

// Обновление информации о пользователе (только для администратора)
exports.updateUser = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Только администратор может обновлять информацию о пользователях' });
    }

    const updatedUser = await User.update(req.params.id, req.body);
    res.json({ message: 'Информация о пользователе обновлена успешно', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении пользователя', error: error.message });
  }
};
