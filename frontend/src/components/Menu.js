import React, { useState } from 'react';
import WishlistModal from './modals/WishlistModal'; 
import CartModal from './modals/CartModal';
import RegisterModal from './modals/RegisterModal';
import UserProfileModal from './modals/UserProfileModal'; 
import '../style/Menu.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import Button from '@mui/material/Button';

function Menu({ toggleAdminPanel }) { 
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); 

  const handleLogout = () => {
    dispatch(logout()); 
    setIsProfileOpen(false); 
  };

  const openProfile = () => setIsProfileOpen(true); 
  const closeProfile = () => setIsProfileOpen(false); 

  return (
    <div>
      <div id='page-header'>
        <div id='logo-div'>
          <img id='logo' src='images/bookland-logo.jpg' alt="Логотип" />
        </div>
        <div id='user-div'>
          <img 
            className='icon-menu-item' 
            src='images/icons/icons8-heart-50.png' 
            onClick={() => setOpenWishlist(true)} 
            alt="Список желаний" 
          />
          <img 
            className='icon-menu-item' 
            src='images/icons/icons8-cart-30.png' 
            onClick={() => setOpenCart(true)} 
            alt="Корзина" 
          />
          
          {user ? (
            <>
              <img 
                className='icon-menu-item' 
                src='images/icons/icons8-account-48.png' 
                onClick={openProfile} 
                alt="Профиль" 
              />
              <UserProfileModal isOpen={isProfileOpen} closeProfile={closeProfile} /> 
              <button onClick={handleLogout} className='logout-button'>Выйти</button>

            
              {user.role === 'admin' && (
                <Button 
                  variant="contained" 
                  onClick={toggleAdminPanel} 
                  className="admin-button"
                >
                  Административная панель
                </Button>
              )}
            </>
          ) : (
            <img 
              className='icon-menu-item' 
              src='images/icons/icons8-account-48.png' 
              onClick={() => setOpenRegister(true)} 
              alt="Войти" 
            />
          )}
        </div>      
      </div>
      {openWishlist && <WishlistModal setOpenWishlistModal={setOpenWishlist} />}
      {openRegister && <RegisterModal setOpenRegisterModal={setOpenRegister} />}
      {openCart && <CartModal setOpenCartModal={setOpenCart} />}
    </div>
  );
}

export default Menu;
