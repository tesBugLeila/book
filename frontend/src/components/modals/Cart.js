import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { removeFromCartAsync } from "../../redux/cartSlice";
import CartItem from './CartItem';
import '../../style/modals/CartModal.css'; 

export default function Cart({ setViewCheckout, setSelectedItems }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const books = useSelector((state) => state.books.books) || [];

  const validCartItems = cartItems.filter(item => item && item !== 'undefined');

  const cartBooks = validCartItems.map(id => books.find(book => book.id === id)).filter(Boolean);

 
  const totalAmount = cartBooks.reduce((total, item) => total + item.price, 0);

  useEffect(() => {
    console.log('validCartItems:', validCartItems);
    console.log('cartBooks:', cartBooks);
  }, [validCartItems, cartBooks]);

  const handleRemoveFromCart = async (id) => {
    try {
      await dispatch(removeFromCartAsync(id)).unwrap();
      console.log(`Удалено из корзины: ${id}`);
    } catch (error) {
      console.error("Ошибка при удалении из корзины:", error);
    }
  };

  const handleSelectForCheckout = (item) => {
    setSelectedItems([item]); 
    setViewCheckout(true);
  };

  return (
    <div className='cart-modal-content'>
      <div className='cart-modal-title-container'>
        <p>Ваша корзина</p>
      </div>
      {cartBooks.length > 0 ? (
        <>
          <div className='cart-modal-items-container'>
            {cartBooks.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onRemove={handleRemoveFromCart} 
                onSelectForCheckout={handleSelectForCheckout}
              />
            ))}
          </div>
          <div className="cart-modal-total">
            <p>Итого: <span>{`₽${totalAmount}`}</span></p>
          </div>
          <div className="cart-modal-checkout-button-div">
  
          </div>
        </>
      ) : (
        <div className='cart-modal-empty-cart-div'>
          <p>Ваша корзина пуста.</p>
        </div>
      )}
    </div>
  );
}
