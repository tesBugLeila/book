import '../style/Footer.css';
import { openMaps, openEmail } from '../helpers';

function Footer() {
  
  return (
    <div id="footer">
      <div id="footer-info">
        <div id="footer-contact">
          <div className='footer-contact-link'>
            <img src='images/icons/icons8-location-white-50.png' alt="Иконка местоположения"></img>
            <p onClick={() => {openMaps() }}>Улица Корнелия, 24, Нью-Йорк</p>
          </div>
          <div className='footer-contact-link'>
            <img src='images/icons/icons8-phone-white-50.png' alt="Иконка телефона"></img>
            <p>+978 574 55 43</p>
          </div>
          <div className='footer-contact-link'>
            <img src='images/icons/icons8-mail-white-50.png' alt="Иконка почты"></img>
            <p onClick={() => {openEmail('bookland@gmail.com') }}>bookland@gmail.com</p>
          </div>
        </div>
        <div id="footer-company-info">
          <p id="footer-title">О НАС</p>
          <p id='company-text'>Мы предлагаем огромный выбор книг в различных категориях: художественная литература, научная литература, биографии, история, религия, саморазвитие и детская литература. Мы также располагаем обширной коллекцией книг по инвестициям и менеджменту, компьютерным наукам, инженерии, медицине, а также учебными пособиями для колледжей и школ, рекомендованными различными учреждениями по всей стране.</p>           
          <div id="footer-socials">
            <img className='footer-social-link' src="images/icons/icons8-instagram-white-50.png" alt="Instagram"></img> 
            <img className='footer-social-link' src="images/icons/icons8-facebook-white-50.png" alt="Facebook"></img>
            <img className='footer-social-link' src="images/icons/icons8-twitter-white-64.png" alt="Twitter"></img>
          </div>
        </div>
      </div>
      <p id="copyright">Copyright© 2023 BOOKLAND Все права защищены.</p>    
    </div>
  );
}

export default Footer;
