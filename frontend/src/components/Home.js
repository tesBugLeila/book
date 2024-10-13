import HomeNewsSlider from "./HomeNewsSlider";
import '../style/Home.css';

function Home() {
  return (
    <section id='home-page'>
      <HomeNewsSlider />
      <p className='section-title'>ИЗУЧАЙТЕ МАГИЧЕСКИЙ МИР ЛИТЕРАТУРЫ</p>
      <p id='home-text'>Мы приглашаем вас отправиться в литературное путешествие вместе с нами в Bookland. Независимо от того, ищете ли вы знания, приключения или утешение, вы найдете это на страницах наших тщательно отобранных книг. Присоединяйтесь к нашему сообществу, исследуйте наши полки и позвольте миру литературы развернуться перед вами.</p>      
      <div id='tags'>
        <div className='tag-div'>
          <img src='images/icons/icons8-delivery-gold.png' alt="Иконка быстрой доставки"></img>
          <p>Быстрая доставка</p>
        </div>
        <div className='tag-div'>
          <img src='images/icons/icons8-price-gold.png' alt="Иконка низких цен"></img>
          <p>Низкие цены</p>
        </div>
        <div className='tag-div'>
          <img src='images/icons/icons8-card.png' alt="Иконка безопасной оплаты"></img>
          <p>Безопасная оплата</p>
        </div>
      </div>  
      <div id='shop-button'>
        <a id='shop-link' href='#products-page'>Покупать сейчас &gt;</a>
      </div>
    </section>
  );
}

export default Home;
