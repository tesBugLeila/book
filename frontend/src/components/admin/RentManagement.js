
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRentals, returnBook } from '../../redux/rentalsSlice';
import '../../style/Admin/RentManagement.css';
import '../../style/Admin/AdminCommon.css'; 

export default function RentManagement() {
  const dispatch = useDispatch();
  const { rentals, loading: isLoading, error } = useSelector(state => state.rentals);
  const { books } = useSelector(state => state.books);

  const [filters, setFilters] = useState({
    rentalId: '',
    userId: '',
    userEmail: '',
    bookTitle: '',
    rentalPeriod: '',
    status: '',
    reminderSent: '', 
  });

  useEffect(() => {
    dispatch(fetchAllRentals());
  }, [dispatch]);

  const handleReturn = (rentalId) => {
    if (window.confirm('Книга возвращена?')) {
      dispatch(returnBook(rentalId));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const translateStatus = (status) => {
    const statusMap = {
      active: 'Активная',
      returned: 'Возвращена',
      overdue: 'Просрочена',
    };
    return statusMap[status] || status;
  };

  const filteredRentals = rentals.filter(rental => {
    const rentalPeriod = `${new Date(rental.rentalStartDate).toLocaleDateString()} - ${new Date(rental.rentalEndDate).toLocaleDateString()}`;
    const bookTitle = books.find(book => book.id === rental.bookId)?.title || 'Не найдено';
    const reminderSentText = rental.reminderSent ? 'Отправлено' : 'Не отправлено';

    return (
      (filters.rentalId === '' || rental.id.toString().includes(filters.rentalId)) &&
      (filters.userId === '' || rental.userId.toString().includes(filters.userId)) &&
      (filters.userEmail === '' || (rental.userEmail && rental.userEmail.toLowerCase().includes(filters.userEmail.toLowerCase()))) &&
      (filters.bookTitle === '' || bookTitle.toLowerCase().includes(filters.bookTitle.toLowerCase())) &&
      (filters.rentalPeriod === '' || rentalPeriod.includes(filters.rentalPeriod)) &&
      (filters.status === '' || translateStatus(rental.status).toLowerCase().includes(filters.status.toLowerCase())) &&
      (filters.reminderSent === '' || reminderSentText.toLowerCase().includes(filters.reminderSent.toLowerCase()))
    );
  });

  if (isLoading) return <p>Загрузка...</p>;

  if (error) {
    if (error.includes('404') && rentals.length === 0) {
      return <p>Аренды не найдены</p>;
    }
    return <p>Ошибка: {error}</p>;
  }

  if (filteredRentals.length === 0) {
    return <p>Аренды не найдены</p>;
  }

  return (
    <div className="rent-management">
      <h3 className="admin-section-title">Управление арендой книг</h3>
      <table className="admin-table rentals-table">
        <thead>
          <tr>
            <th>
              ID Аренды
              <input
                type="text"
                name="rentalId"
                className="admin-table-filter"
                value={filters.rentalId}
                onChange={handleFilterChange}
                placeholder="Фильтр"
              />
            </th>
            <th>
              ID Пользователя
              <input
                type="text"
                name="userId"
                className="admin-table-filter"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="Фильтр"
              />
            </th>
            <th>
              Email Пользователя
              <input
                type="text"
                name="userEmail"
                className="admin-table-filter"
                value={filters.userEmail}
                onChange={handleFilterChange}
                placeholder="Фильтр"
              />
            </th>
            <th>
              Заголовок Книги
              <input
                type="text"
                name="bookTitle"
                className="admin-table-filter"
                value={filters.bookTitle}
                onChange={handleFilterChange}
                placeholder="Фильтр"
              />
            </th>
            <th>
              Срок аренды
              <input
                type="text"
                name="rentalPeriod"
                className="admin-table-filter"
                value={filters.rentalPeriod}
                onChange={handleFilterChange}
                placeholder="Фильтр"
              />
            </th>
            <th>
              Статус
              <input
                type="text"
                name="status"
                className="admin-table-filter"
                value={filters.status}
                onChange={handleFilterChange}
                placeholder="Фильтр"
              />
            </th>
            <th>
              Напоминание
              <select
                name="reminderSent"
                className="admin-table-filter"
                value={filters.reminderSent}
                onChange={handleFilterChange}
              >
                <option value="">Все</option>
                <option value="отправлено">Отправлено</option>
                <option value="не отправлено">Не отправлено</option>
              </select>
            </th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredRentals.map(rental => {
            const bookTitle = books.find(book => book.id === rental.bookId)?.title || 'Не найдено';
            const reminderSentText = rental.reminderSent ? 'Отправлено' : 'Не отправлено';
            return (
              <tr key={rental.id}>
                <td>{rental.id}</td>
                <td>{rental.userId}</td>
                <td>{rental.userEmail}</td>
                <td>{bookTitle}</td>
                <td>
                  {new Date(rental.rentalStartDate).toLocaleDateString()} - 
                  {new Date(rental.rentalEndDate).toLocaleDateString()}
                </td>
                <td>{translateStatus(rental.status)}</td>
                <td>{reminderSentText}</td>
                <td>
                  {rental.status === 'active' && (
                    <button className="admin-table-button" onClick={() => handleReturn(rental.id)}>Вернуть</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
