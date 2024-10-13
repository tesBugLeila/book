import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPurchase } from '../../redux/purchasesSlice';
import { createRental } from '../../redux/rentalsSlice';
import '../../style/modals/CartItem.css'; 

export default function CartItem({ item, onRemove }) {
  const dispatch = useDispatch();
  const [rentalDuration, setRentalDuration] = useState('2 weeks'); 

  const handlePurchase = () => {
    dispatch(createPurchase(item.id))
      .unwrap()
      .then(() => {
        alert('Книга куплена успешно!');
        onRemove(item.id); 
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleRental = () => {
 
    let durationInMonths;
    switch (rentalDuration) {
      case '2 weeks':
        durationInMonths = 1; 
        break;
      case '1 month':
        durationInMonths = 1;
        break;
      case '3 months':
        durationInMonths = 3;
        break;
      default:
        durationInMonths = 1;
    }

    dispatch(createRental({ bookId: item.id, rentalDuration: durationInMonths }))
      .unwrap()
      .then(() => {
        alert('Книга арендована успешно!');
        onRemove(item.id); 
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className='cart-item'>
      <div className="cart-item-image-container">
        <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
      </div>
      <div className="cart-item-info-container">
        <p className="cart-item-title">{item.title}</p>
        <p className="cart-item-author">{item.author}</p>
        <p className="cart-item-price">{`₽${item.price}`}</p>
      </div>
      <div className="cart-item-buttons-container">
        <button className='cart-item-remove-button' onClick={() => onRemove(item.id)}>
          <img className='trash-icon' src='images/icons/icons8-trash-30.png' alt="Удалить" />
        </button>
        <button className='cart-item-purchase-button' onClick={handlePurchase}>Купить</button>
        <div className="cart-item-rental-options">
          <select 
            className="cart-item-rental-select"
            value={rentalDuration} 
            onChange={(e) => setRentalDuration(e.target.value)}
          >
            <option value="2 weeks">2 недели</option>
            <option value="1 month">1 месяц</option>
            <option value="3 months">3 месяца</option>
          </select>
          <button className='cart-item-rental-button' onClick={handleRental}>Арендовать</button>
        </div>
      </div>
    </div>
  );
}
