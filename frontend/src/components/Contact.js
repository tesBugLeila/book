import '../style/Contact.css';
import { openMaps, openEmail } from '../helpers';

function Contact() {
  return (
    <section id='contact-page'>
      <div id='contact-options'>
        <div id='message-form'>
          <div>
            <p id='contact-title'>СВЯЖИТЕСЬ С НАМИ</p>
          </div> 
          <div id='contact-info-div'>
            <div id='company-info-div'>
              <div id='location-icon-div'>
                <img src='images/icons/icons8-location-contact-96.png' alt="Иконка местоположения"></img>
              </div>
              <div id='address-div'>
                <p id='company-title'>BOOKLAND</p>
                <p className='link' onClick={ () => {openMaps()} }>Улица Корнелия, 24</p>
                <p>Нью-Йорк, NY 10014</p>
                <p>США</p>
              </div>
            </div>
            <div id='phone-mail-div'>
              <div className='contact-link'>
                <img src='images/icons/icons8-phone-contact-48.png' alt="Иконка телефона"></img>
                <p>+978 574 55 43</p>
              </div>
              <div className='contact-link'>
                <img src='images/icons/icons8-mail-contact-24.png' alt="Иконка почты"></img>
                <p className='link' onClick={() => {openEmail('bookland@gmail.com')}}>bookland@gmail.com</p>
              </div>
            </div>            
          </div>
          <div className='sender-info-row'>
            <input className='sender-input' type="text" placeholder="Имя"></input>
            <input className='sender-input second' type="text" placeholder="Фамилия"></input>
          </div>
          <div className='sender-info-row'>
            <input className='sender-input' type="text" placeholder="Электронная почта"></input>
            <input className='sender-input second' type='text' placeholder='Телефон'></input>
          </div>
          <textarea id='message-input' rows="20" cols="50" placeholder='Сообщение'></textarea>
          <div>
            <p id='submit-button'>ОТПРАВИТЬ СООБЩЕНИЕ</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
