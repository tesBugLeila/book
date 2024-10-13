import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser, updateUser } from '../../redux/adminSlice';
import '../../style/Admin/UserManagement.css';
import '../../style/Admin/AdminCommon.css'; 

export default function UserManagement() {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.admin);
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatedData, setUpdatedData] = useState({});


  const [filters, setFilters] = useState({
    username: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setUpdatedData({ username: user.username, email: user.email, role: user.role });
  };

  const handleUpdate = async (userId) => {
    dispatch(updateUser({ userId, updatedData }));
    dispatch(fetchAllUsers()); 
    setEditingUserId(null);
  };
  

  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };


const filteredUsers = users.filter(user => {
  
  const displayedRole = user.role === 'admin' ? 'Администратор' : 'Пользователь';
  
  return (
    (user.username?.toLowerCase() || '').includes(filters.username.toLowerCase()) &&
    (user.email?.toLowerCase() || '').includes(filters.email.toLowerCase()) &&
    displayedRole.toLowerCase().includes(filters.role.toLowerCase()) 
  );
});


  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className="user-management">
      <h2 className="admin-section-title">Управление пользователями</h2>
      {users.length === 0 ? (
        <p>Пользователей нет</p>
      ) : (
        <table className="admin-table users-table">
          <thead>
            <tr>
              <th>
                Имя
                <input
                  type="text"
                  name="username"
                  className="admin-table-filter"
                  value={filters.username}
                  onChange={handleFilterChange}
                  placeholder="Фильтр"
                />
              </th>
              <th>
                Email
                <input
                  type="email"
                  name="email"
                  className="admin-table-filter"
                  value={filters.email}
                  onChange={handleFilterChange}
                  placeholder="Фильтр"
                />
              </th>
              <th>
                Роль
                <input
                  type="text"
                  name="role"
                  className="admin-table-filter"
                  value={filters.role}
                  onChange={handleFilterChange}
                  placeholder="Фильтр"
                />
              </th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      name="username"
                      value={updatedData.username}
                      onChange={handleChange}
                      className="admin-table-filter"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <input
                      type="email"
                      name="email"
                      value={updatedData.email}
                      onChange={handleChange}
                      className="admin-table-filter"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <select
                      name="role"
                      value={updatedData.role}
                      onChange={handleChange}
                      className="admin-table-filter"
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  ) : (
                    user.role === 'admin' ? 'Администратор' : 'Пользователь'
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <button className="admin-table-button" onClick={() => handleUpdate(user.id)}>Сохранить</button>
                  ) : (
                    <>
                      <button className="admin-table-button" onClick={() => handleEdit(user)}>Редактировать</button>
                      <button className="admin-table-button" onClick={() => handleDelete(user.id)}>Удалить</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
