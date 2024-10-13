import '../style/slick.css';
import '../style/slick-theme.css';
import '../style/Review.css';
import { getRatingStars } from '../helpers';

function Rating(props) {
  return (
    <div className={props.divClass}>
      {getRatingStars(props.rating).map((star, index) => (
        <img 
          key={index}
          className={props.starClass} 
          src={star} 
          style={{ width: '20px', height: '20px' }} 
          alt="Rating star" 
        />
      ))}
    </div>
  );
}

export default Rating;
