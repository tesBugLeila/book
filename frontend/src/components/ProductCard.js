
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, removeFromCartAsync } from "../redux/cartSlice";
import { addToWishlistAsync, removeFromWishlistAsync } from "../redux/wishlistSlice";
import Rating from "./Rating";


function ProductCard({ product, onClick }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];

  const isInCart = cartItems.includes(product.id);
  const isInWishlist = wishlistItems.includes(product.id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      if (!product.id) {
        console.error('Не удалось добавить в корзину: ID книги отсутствует');
        return;
      }
      if (isInCart) {
        await dispatch(removeFromCartAsync(product.id)).unwrap();
        console.log(`Удалено из корзины: ${product.title}`);
      } else {
        await dispatch(addToCartAsync(product.id)).unwrap();
        console.log(`Добавлено в корзину: ${product.title}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToFavorites = async (e) => {
    e.stopPropagation();
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlistAsync(product.id)).unwrap();
      } else {
        await dispatch(addToWishlistAsync(product.id)).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "green";
      case "reserved":
        return "orange";
      case "sold":
        return "red";
      case "rented":
        return "blue";
      case "unavailable":
        return "gray";
      default:
        return "black";
    }
  };

 
  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Доступна";
      case "reserved":
        return "Зарезервирована";
      case "sold":
        return "Куплена";
      case "rented":
        return "В аренде";
      case "unavailable":
        return "Недоступна";
      default:
        return "Неизвестный статус";
    }
  };

  return (
    <div
      className={`product-card ${
        product.status === "unavailable" ? "unavailable" : ""
      }`}
      onClick={onClick}
    >
      <img
        className="product-image"
        src={product.imageUrl}
        alt={product.title}
        style={{ cursor: "pointer" }}
      />

      <div className="cart-fav-buttons">
        <button className="cart-button" onClick={handleAddToCart}>
          {isInCart ? "Удалить из корзины" : "Добавить в корзину"}
          <img
            className="cart-icon"
            src="images/icons/icons8-cart-white-30.png"
            alt="Cart Icon"
          />
        </button>
        <button className="fav-button" onClick={handleAddToFavorites}>
          <img
            className="heart-icon"
            src={
              isInWishlist
                ? "images/icons/icons8-heart-filled-50.png"
                : "images/icons/icons8-heart-outline-50.png"
            }
            alt="Favorite Icon"
          />
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-author">{product.author}</p>
        <div className="product-footer">
          <p className="product-price">{`₽${product.price}`}</p>
          <Rating rating={Math.round(product.rating)} />
        </div>
        <p
          className="product-status"
          style={{ color: getStatusColor(product.status) }}
        >
          {getStatusText(product.status)}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
