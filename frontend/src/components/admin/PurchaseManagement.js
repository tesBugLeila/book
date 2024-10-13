import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPurchases } from '../../redux/purchasesSlice';  
import '../../style/Admin/PurchaseManagement.css';
import '../../style/Admin/AdminCommon.css';


export default function PurchaseManagement() {
  const dispatch = useDispatch();
  const { purchases, isLoading, error } = useSelector((state) => state.purchases);


  const [filters, setFilters] = useState({
    purchaseId: '',
    userId: '',
    bookId: '',
    bookTitle: '', 
    purchaseDate: '',
  });

  useEffect(() => {
   
    dispatch(fetchAllPurchases());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

 
  const filteredPurchases = purchases.filter(purchase => {
    return (
      (filters.purchaseId === '' || purchase.id.toString().includes(filters.purchaseId)) &&
      (filters.userId === '' || purchase.userId.toString().includes(filters.userId)) &&
      (filters.bookId === '' || purchase.bookId.toString().includes(filters.bookId)) &&
      (filters.bookTitle === '' || purchase.bookTitle.includes(filters.bookTitle)) && 
      (filters.purchaseDate === '' || new Date(purchase.purchaseDate).toLocaleDateString().includes(filters.purchaseDate))
    );
  });

 
  if (isLoading) return <p>Загрузка...</p>;
  

  if (error) return <p>Ошибка: {error}</p>;


  return (
    <div className="purchase-management">
      <h3 className="admin-section-title">Управление покупками</h3>
      {purchases.length === 0 ? (
        <p>Покупок нет</p>
      ) : (
        <table className="admin-table purchases-table">
          <thead>
            <tr>
              <th>
                ID Покупки
                <input
                  type="text"
                  name="purchaseId"
                  className="admin-table-filter"
                  value={filters.purchaseId}
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
                Название книги
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
                Дата покупки
                <input
                  type="text"
                  name="purchaseDate"
                  className="admin-table-filter"
                  value={filters.purchaseDate}
                  onChange={handleFilterChange}
                  placeholder="Фильтр"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.id}</td>
                <td>{purchase.userId}</td>
                <td>{purchase.bookTitle}</td>
                <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
