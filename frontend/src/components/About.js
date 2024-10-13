import '../style/About.css';

function About() {
  return (
    <section id='about-page'>
      <p className='section-title'>О НАС</p>
      <div className="about-cards">
        <div className="about-section">
          <img className="about-section-image" id='about1' src='images/about1.jpg' alt="Наша команда"></img>
          <div className="about-section-info">
            <p className="about-section-title">КТО МЫ?</p>
            <p className="about-section-text">
              Мы, команда Bookland, основаны в 2012 году и уже более 10 лет радуем книголюбов и энтузиастов чтения. Наша история началась с простой мечты — создать убежище для любителей книг, место, где магия литературы не знает границ. На протяжении этих лет мы росли и развивались, но наша приверженность любви к книгам остается неизменной.
            </p>
          </div>
        </div>
        <div className="about-section">
          <div className="about-section-info">
            <p className="about-section-title">НАША МИССИЯ</p>
            <p className="about-section-text">
              Наша миссия — соединить людей с написанным словом, разжечь радость чтения и стать источником вдохновения для всех. Мы предлагаем обширную коллекцию книг различных жанров, от вечных классиков до современных бестселлеров, гарантируя, что каждый найдет что-то по своему вкусу. Мы гордимся своей ролью хранителей культуры, сохраняя богатое многообразие человеческих историй через литературу.
            </p>
          </div>
          <img className="about-section-image" id='about2' src='images/about2.jpg' alt="Наши книги"></img>
        </div>
      </div>
    </section>
  );
}

export default About;
