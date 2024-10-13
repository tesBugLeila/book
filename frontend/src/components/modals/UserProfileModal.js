import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserByToken } from '../../redux/authSlice';
import '../../style/modals/UserProfileModal.css'; 

export default function UserProfileModal({ isOpen, closeProfile }) {
  const dispatch = useDispatch();
  const { user, token, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) { 
      dispatch(fetchUserByToken());
    }
  }, [token, user, dispatch]);

  if (!isOpen) return null; 

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={closeProfile}>&times;</span>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : user ? (
          <div>
            <h2>Добро пожаловать, {user.username}!</h2>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p>Вы не авторизованы</p>
        )}
      </div>
    </div>
  );
}
