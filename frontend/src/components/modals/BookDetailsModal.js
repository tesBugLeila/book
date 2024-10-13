import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookById, clearSelectedBook } from "../../redux/booksSlice";
import { addToCartAsync, removeFromCartAsync, fetchCart } from "../../redux/cartSlice";
import { addToWishlistAsync, removeFromWishlistAsync } from "../../redux/wishlistSlice";
import BookDetails from "../BookDetails";
import '../../style/modals/BookDetailsModal.css';

function BookDetailsModal({ isOpen, closeModal, bookId }) {
  const dispatch = useDispatch();
  const { selectedBook, isLoadingSelectedBook, errorSelectedBook } = useSelector((state) => state.books);
  const cartItems = useSelector((state) => state.cart.items) || []; 
  const wishlistItems = useSelector((state) => state.wishlist.items) || []; 
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && bookId) {
      dispatch(fetchBookById(bookId));
      dispatch(fetchCart());
      
    }
    return () => {
      dispatch(clearSelectedBook());
    };
  }, [isOpen, bookId, dispatch]);

  const handleAddToCart = async () => {
    if (selectedBook) {
      setIsProcessing(true);
      try {
        await dispatch(addToCartAsync(selectedBook.id)).unwrap();
      } catch (error) {
        console.error("Ошибка при добавлении в корзину:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRemoveFromCart = async () => {
    if (selectedBook) {
      setIsProcessing(true);
      try {
        await dispatch(removeFromCartAsync(selectedBook.id)).unwrap();
      } catch (error) {
        console.error("Ошибка при удалении из корзины:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAddToFavorites = async () => {
    if (selectedBook) {
      setIsProcessing(true);
      try {
        await dispatch(addToWishlistAsync(selectedBook.id)).unwrap();
      } catch (error) {
        console.error("Ошибка при добавлении в избранное:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (selectedBook) {
      setIsProcessing(true);
      try {
        await dispatch(removeFromWishlistAsync(selectedBook.id)).unwrap();
      } catch (error) {
        console.error("Ошибка при удалении из избранного:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  
  const isBookInCart = selectedBook ? cartItems.includes(selectedBook.id) : false;
  const isBookInWishlist = selectedBook ? wishlistItems.includes(selectedBook.id) : false;

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>
        {isLoadingSelectedBook ? (
          <p>Загрузка...</p>
        ) : errorSelectedBook ? (
          <div className="error-message">
            <p>{errorSelectedBook.message || "Книга не найдена."}</p>
            <button onClick={() => dispatch(fetchBookById(bookId))}>Попробовать снова</button>
          </div>
        ) : selectedBook ? (
          <BookDetails
            book={selectedBook}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
            isProcessing={isProcessing}
            isInCart={isBookInCart}
            isInWishlist={isBookInWishlist}
          />
        ) : (
          <p>Книга не найдена.</p>
        )}
      </div>
    </div>
  );
}

export default BookDetailsModal;
