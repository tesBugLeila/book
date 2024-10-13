import '../../style/modals/Modal.css';
import '../../style/modals/LoginModal.css';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useState } from "react";

export default function RegisterModal({ setOpenRegisterModal }) { 
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <div className='modal-bg'>
      {openLogin ? (
        <div id='login-modal'>
          <button className="modal-close-main" onClick={() => setOpenRegisterModal(false)}> 
            <img src='images/icons/icons8-close-24.png' alt="Close" />
          </button>
          <LoginForm setViewLogin={setOpenLogin} setOpenRegisterModal={setOpenRegisterModal} /> 
        </div>
      ) : (
        <div id='register-modal' className="modal-content-container">
          <button className="modal-close-main" onClick={() => setOpenRegisterModal(false)}> 
            <img src='images/icons/icons8-close-24.png' alt="Close" />
          </button>
          <RegisterForm setViewLogin={setOpenLogin} setOpenRegisterModal={setOpenRegisterModal} /> 
        </div>
      )}
    </div>
  );
}
