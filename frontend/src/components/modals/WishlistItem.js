import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../redux/cartSlice';
import { removeFromWishlistAsync } from '../../redux/wishlistSlice';
import '../../style/modals/WishlistModal.css';

export default function WishlistItem({ item }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCartAsync(item.id));
    dispatch(removeFromWishlistAsync(item.id));
  };

  const handleRemove = () => {
    dispatch(removeFromWishlistAsync(item.id));
  };


  return (
    <div className="item">
      <div className="image-container">
        <img src={item.imageUrl} alt={item.title} className="wishlist-item-image" />
      </div>
      <div className="item-info-container">
        <p className="item-title">{item.title}</p>
        <p className="item-author">{item.author}</p>
        <p className="item-price_wish">{`₽${item.price}`}</p>
      </div>
      <div className="buttons-container">
        <img
          className='cart'
          src='images/icons/icons8-cart-30.png'
          onClick={handleAddToCart}
          alt="Добавить в корзину"
        />
        <img
          className='trash'
          src='images/icons/icons8-trash-30.png'
          onClick={handleRemove}
          alt="Удалить из избранного"
        />
      </div>
    </div>
  );
}
