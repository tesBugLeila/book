import React, { Component } from "react";
import Slider from "react-slick";
import '../style/slick.css';
import '../style/slick-theme.css';
import news from "../data/news";

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      autoplay: true,
      autoplaySpeed: 3000,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div className="news-slider">
        <Slider {...settings}>
          {
            news.map((slide, index) => (
              <img 
                key={index} // Использование индекса как ключа
                className="banner" 
                src={slide.image} 
                alt={slide.title || "News Banner"} // Рекомендуется добавить атрибут alt
              />
            ))
          }
        </Slider>
      </div>
    )
  }
}
