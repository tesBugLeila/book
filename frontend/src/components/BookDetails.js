import React from "react";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlistAsync, removeFromWishlistAsync } from "../redux/wishlistSlice";

function BookDetails({
  book,
  onAddToCart,
  onRemoveFromCart,
  isProcessing,
  isInCart
}) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.includes(book.id);

  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlistAsync(book.id)).unwrap();
      } else {
        await dispatch(addToWishlistAsync(book.id)).unwrap();
      }
    } catch (error) {
      console.error("Ошибка при изменении избранного:", error);
    }
  };

  if (!book) return <p>Книга не найдена.</p>;

  return (
    <div className="book-details">
      <img className="book-image" src={book.imageUrl} alt={book.title} />
      <div className="book-info">
        <h2>{book.title}</h2>
        <p>Автор: {book.author}</p>
        <p>Категория: {book.category}</p>
        <p>Цена: ₽{book.price}</p>
        <Rating rating={Math.round(book.rating)} starClass="rating-star" divClass="rating-div" />
        <p>{book.description}</p>
        <div className="book-actions">
        
          <button
            className="add-to-cart-button"
            onClick={isInCart ? onRemoveFromCart : onAddToCart}
            disabled={isProcessing}
          >
            {isInCart ? "Удалить из корзины" : "Добавить в корзину"}
          </button>
          
          <button
            className="add-to-favorites-button"
            onClick={handleToggleWishlist}
            disabled={isProcessing}
          >
            {isInWishlist ? "Удалить из избранного" : "Добавить в избранное"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
