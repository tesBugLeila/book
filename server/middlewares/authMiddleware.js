const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(403).json({ msg: 'Токен не найден, доступ запрещён' });
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  
    req.userRole = decoded.role;    
    next();
  } catch (err) {
    console.error('Token verification error:', err);  
    res.status(403).json({ msg: 'Недействительный токен' });
  }
}

// Проверка роли администратора
function adminMiddleware(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ msg: 'Доступ запрещен: требуется роль администратора' });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
