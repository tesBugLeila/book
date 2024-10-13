import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom"; 

export default function RegisterForm({ setViewLogin, setOpenRegisterModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    dispatch(register({ username, email, password }));
  };

  useEffect(() => {
    console.log('RegisterForm useEffect:', { user, error });
    if (user && !error) {
      setOpenRegisterModal(false);
      navigate('/'); 
    }
  }, [user, error, setOpenRegisterModal, navigate]);

  return (
    <div id="register">
      <div className="title-container">
        <p>Регистрация</p>
      </div>
      <div className="form-container">
        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={20}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button className="login-button" onClick={handleRegister} disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
        {error && (
          <p className="error-message">{error.message || "Произошла ошибка"}</p>
        )}
        <div className="info-div">
          <p className="info-p">Уже есть аккаунт?</p>
          <button className="login-link" onClick={() => setViewLogin(true)}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
