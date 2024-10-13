import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductFilters from "./ProductFilters";
import ProductCard from "./ProductCard";
import "../style/Products.css";
import { fetchBooks } from "../redux/booksSlice";
import BookDetailsModal from "./modals/BookDetailsModal";

function Products() {
  const dispatch = useDispatch();
  const { books, isLoadingBooks, errorBooks } = useSelector((state) => state.books);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const [filters, setFilters] = useState({
    selectedCategory: "",
    sortOption: "",
    viewOption: "grid",
  });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleOpenModal = (bookId) => {
    setSelectedBookId(bookId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBookId(null);
    setIsModalOpen(false);
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Set(books.map(book => book.category).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [books]);

  
  const filteredBooks = useMemo(() => {
    let filtered = books;

    if (filters.selectedCategory) {
      filtered = filtered.filter((book) => book.category === filters.selectedCategory);
    }

    if (filters.sortOption) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortOption) {
          case "price":
            return a.price - b.price;
          case "rating":
            return b.rating - a.rating;
          case "author":
            return a.author.localeCompare(b.author);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [books, filters]);

  return (
    <section id="products-page">
      <h2 className="section-title">НАШИ КНИГИ</h2>
      <ProductFilters categories={categories} onFilterChange={handleFilterChange} />
      <div className={`products-grid ${filters.viewOption === "list" ? "list-view" : "grid-view"}`}>
        {isLoadingBooks ? (
          <p>Загрузка...</p>
        ) : errorBooks ? (
          <p className="error-message">
            {errorBooks.message || "Произошла ошибка"}
          </p>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onClick={() => handleOpenModal(item.id)}
            />
          ))
        ) : (
          <p>Книги не найдены.</p>
        )}
      </div>
      <BookDetailsModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        bookId={selectedBookId}
      />
    </section>
  );
}

export default Products;
