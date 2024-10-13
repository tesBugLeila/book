
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from "../../redux/authSlice";
import { useNavigate } from 'react-router-dom'; 

export default function LoginForm({ setViewLogin, setOpenRegisterModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    console.log('LoginForm useEffect:', { user, error });
    if (user && !error) {
      setOpenRegisterModal(false);
      navigate('/'); 
    }
  }, [user, error, setOpenRegisterModal, navigate]);

  return (
    <div id="login">
      <div className="title-container">
        <p>Вход</p>
      </div>
      <div className="form-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button className="login-button" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Войти"}
        </button>
        {error && (
          <p className="error-message">{error.message || "Произошла ошибка"}</p>
        )}
        <div className="info-div">
          <p className="info-p">Нет аккаунта?</p>
          <button className="login-link" onClick={() => setViewLogin(false)}>
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}
