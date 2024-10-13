import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../redux/booksSlice";
import "../../style/Admin/BookManagement.css";
import "../../style/Admin/AdminCommon.css"; 



export default function BookManagement() {
  const dispatch = useDispatch();
  const { books, isLoadingBooks, errorBooks } = useSelector(
    (state) => state.books
  );
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    year: "",
    price: "",
    status: "available",
    image: null,
    rating: "", 
  });

  const [filters, setFilters] = useState({
    title: "",
    author: "",
    category: "",
    year: "",
    price: "",
    status: "",
  });

  const [editBookId, setEditBookId] = useState(null); 
  const [tempBook, setTempBook] = useState(null); 

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewBook((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBook(newBook));
    setNewBook({
      title: "",
      author: "",
      category: "",
      year: "",
      price: "",
      status: "available",
      image: null,
      rating: "", 
    });
  };

  const handleDelete = (bookId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту книгу?")) {
      dispatch(deleteBook(bookId));
    }
  };

  const handleEditStart = (book) => {
    setEditBookId(book.id);
    setTempBook({ ...book }); 
  };

  const handleCancelEdit = () => {
    setEditBookId(null); 
    setTempBook(null);  
  };

  const handleUpdate = () => {
    if (tempBook) {
      dispatch(updateBook({ bookId: tempBook.id, updatedData: tempBook }))
        .unwrap()  
        .then(() => {
          dispatch(fetchBooks());  
        });
      setEditBookId(null); 
      setTempBook(null);   
    }
  };

  const handleChangeBookField = (fieldName, value) => {
    if (tempBook) {
      setTempBook((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  const getStatusInRussian = (status) => {
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
        return status;
    }
  };

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      book.author.toLowerCase().includes(filters.author.toLowerCase()) &&
      book.category.toLowerCase().includes(filters.category.toLowerCase()) &&
      (filters.year === "" || (book.year && book.year.toString().includes(filters.year))) &&
      (filters.price === "" || (book.price && book.price.toString().includes(filters.price))) &&
      getStatusInRussian(book.status)
        .toLowerCase()
        .includes(filters.status.toLowerCase())
    );
  });

  if (isLoadingBooks) return <p>Загрузка...</p>;
  if (errorBooks) return <p>Ошибка: {errorBooks}</p>;

  return (
    <div className="book-management">
      <h3 className="admin-section-title">Управление книгами</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        {/* Форма для добавления новой книги */}
        <input
          type="text"
          name="title"
          placeholder="Название"
          value={newBook.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Автор"
          value={newBook.author}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Категория"
          value={newBook.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Год написания"
          value={newBook.year}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          value={newBook.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Рейтинг (от 1 до 5)"
          value={newBook.rating}
          onChange={handleChange}
          min="1"
          max="5"
          required
        />
        <select name="status" value={newBook.status} onChange={handleChange}>
          <option value="available">Доступна</option>
          <option value="reserved">Зарезервирована</option>
          <option value="sold">Куплена</option>
          <option value="rented">В аренде</option>
          <option value="unavailable">Недоступна</option>
        </select>
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit" className="admin-form-button">
          Добавить книгу
        </button>
      </form>

      <div className="filters">
        {/* Фильтры для поиска книг */}
        <input
          type="text"
          name="title"
          className="admin-table-filter"
          value={filters.title}
          onChange={handleFilterChange}
          placeholder="Фильтр по названию"
        />
        <input
          type="text"
          name="author"
          className="admin-table-filter"
          value={filters.author}
          onChange={handleFilterChange}
          placeholder="Фильтр по автору"
        />
        <input
          type="text"
          name="category"
          className="admin-table-filter"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="Фильтр по категории"
        />
        <input
          type="number"
          name="year"
          className="admin-table-filter"
          value={filters.year}
          onChange={handleFilterChange}
          placeholder="Фильтр по году"
        />
        <input
          type="number"
          name="price"
          className="admin-table-filter"
          value={filters.price}
          onChange={handleFilterChange}
          placeholder="Фильтр по цене"
        />
        <select
          name="status"
          className="admin-table-filter"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Все статусы</option>
          <option value="Доступна">Доступна</option>
          <option value="Зарезервирована">Зарезервирована</option>
          <option value="Куплена">Куплена</option>
          <option value="В аренде">В аренде</option>
          <option value="Недоступна">Недоступна</option>
        </select>
      </div>

      <table className="admin-table books-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Автор</th>
            <th>Категория</th>
            <th>Год</th>
            <th>Цена</th>
            <th>Статус</th>
            <th>Рейтинг</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              {editBookId === book.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={tempBook.title}
                      onChange={(e) =>
                        handleChangeBookField("title", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={tempBook.author}
                      onChange={(e) =>
                        handleChangeBookField("author", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={tempBook.category}
                      onChange={(e) =>
                        handleChangeBookField("category", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={tempBook.year}
                      onChange={(e) =>
                        handleChangeBookField("year", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={tempBook.price}
                      onChange={(e) =>
                        handleChangeBookField("price", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={tempBook.status}
                      onChange={(e) =>
                        handleChangeBookField("status", e.target.value)
                      }
                    >
                      <option value="available">Доступна</option>
                      <option value="reserved">Зарезервирована</option>
                      <option value="sold">Куплена</option>
                      <option value="rented">В аренде</option>
                      <option value="unavailable">Недоступна</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={tempBook.rating}
                      onChange={(e) =>
                        handleChangeBookField("rating", e.target.value)
                      }
                      min="1"
                      max="5"
                    />
                  </td>
                  <td>
                    <button  className="admin-button" onClick={handleUpdate}>Сохранить</button>
                    <button  className="admin-button" onClick={handleCancelEdit}>Отмена</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.year}</td>
                  <td>{book.price}</td>
                  <td>{getStatusInRussian(book.status)}</td>
                  <td>{book.rating}</td>
                  <td>
                    <button  className="admin-button" onClick={() => handleEditStart(book)}>Редактировать</button>
                    <button  className="admin-button" onClick={() => handleDelete(book.id)}>Удалить</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
