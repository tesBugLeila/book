import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from '../../redux/cartSlice';
import Cart from './Cart';

import '../../style/modals/CartModal.css'; 

export default function CartModal({ setOpenCartModal }) {
  const [openCheckout, setOpenCheckout] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];

 
  const memoizedCartItems = useMemo(() => cartItems, [cartItems]);

  useEffect(() => {
    
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className='cart-modal-bg' onClick={() => setOpenCartModal(false)}>
      {openCheckout ? (
        <div className='cart-modal-container' id='checkout-modal' onClick={(e) => e.stopPropagation()}>
          <button className="cart-modal-close-button" onClick={() => setOpenCartModal(false)}>
            <img src='images/icons/icons8-close-24.png' alt="Закрыть" />
          </button>
         
        </div>
      ) : (
        <div className='cart-modal-container' id='cart-modal' onClick={(e) => e.stopPropagation()}>
          <button className="cart-modal-close-button" onClick={() => setOpenCartModal(false)}>
            <img src='images/icons/icons8-close-24.png' alt="Закрыть" />
          </button>
          <Cart 
            setViewCheckout={setOpenCheckout} 
            setSelectedItems={setSelectedItems} 
          />
        </div>
      )}
    </div>
  );
}
