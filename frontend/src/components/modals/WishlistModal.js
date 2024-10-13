import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist, fetchWishlistDetails } from '../../redux/wishlistSlice';
import WishlistItem from './WishlistItem';
import '../../style/modals/WishlistModal.css'; 

export default function WishlistModal({ setOpenWishlistModal }) {
  const dispatch = useDispatch();
  const wishlistBooks = useSelector((state) => state.wishlist.bookDetails) || [];

  const memoizedWishlistBooks = useMemo(() => wishlistBooks, [wishlistBooks]);

  useEffect(() => {
    dispatch(fetchWishlist()).then((action) => {
      const wishlistIds = action.payload;
      dispatch(fetchWishlistDetails(wishlistIds));
    });
  }, [dispatch]);

  return (
    <div className='modal-bg' onClick={() => setOpenWishlistModal(false)}>
      <div className='modal-content-container' id='wishlist-modal' onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-wish" onClick={() => setOpenWishlistModal(false)}>
          <img src='images/icons/icons8-close-24.png' alt="Закрыть" />
        </button>
        {memoizedWishlistBooks.length > 0 ? (
          <div className="wishlist-items-container">
            {memoizedWishlistBooks.map((book) => (
              <WishlistItem key={book.id} item={book} />
            ))}
          </div>
        ) : (
          <p>Ваш список избранного пуст.</p>
        )}
      </div>
    </div>
  );
}
