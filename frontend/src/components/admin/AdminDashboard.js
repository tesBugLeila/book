import React, { useState } from 'react';
import UserManagement from './UserManagement';
import BookManagement from './BookManagement';
import PurchaseManagement from './PurchaseManagement';
import RentManagement from './RentManagement';
import '../../style/Admin/AdminDashboard.css';
import '../../style/Admin/AdminCommon.css'; 
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

export default function AdminDashboard({ closeAdminPanel }) {
  const [activeSection, setActiveSection] = useState(null);

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'books':
        return <BookManagement />;
      case 'purchases':
        return <PurchaseManagement />;
      case 'rentals':
        return <RentManagement />;
      default:
        return null;
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="admin-dashboard">
      <Button variant="contained" onClick={closeAdminPanel} className="admin-button close-button">
        Закрыть панель администратора
      </Button>

      <PopupState variant="popover" popupId="admin-menu-popup">
        {(popupState) => (
          <React.Fragment>
            <Button variant="contained" {...bindTrigger(popupState)} className="admin-button">
              Управление данными
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={() => { popupState.close(); toggleSection('users'); }}>Управление пользователями</MenuItem>
              <MenuItem onClick={() => { popupState.close(); toggleSection('books'); }}>Управление книгами</MenuItem>
              <MenuItem onClick={() => { popupState.close(); toggleSection('purchases'); }}>Управление покупками</MenuItem>
              <MenuItem onClick={() => { popupState.close(); toggleSection('rentals'); }}>Управление арендой книг</MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>

      <div className="admin-section">
        {renderSection()}
      </div>
    </div>
  );
}
