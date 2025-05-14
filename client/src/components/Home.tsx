import { useContext } from 'react';
import HomeCategoryList from './HomeCategoryList';
import { Link } from 'react-router-dom';
import '../assets/css/global.css';
import '../assets/css/Home.css';
import '../assets/css/BestSellers.css';
import { Category } from '../contexts/CategoryContext';

function Home() {
  const categories = useContext(Category);
    return (

    <>
      <section className="hero">
        <img 
          src={require('../assets/images/site/hero.jpg')} 
          alt="Library" 
        />
        <div className="hero-content">
          <h1>Ignite Your Reading Journey</h1>
          <Link to="/categories/romance">
            <button className="shop-now-btn">Shop Now</button>
          </Link>
        </div>
      </section>

      <section className="best-sellers" aria-labelledby="best-sellers-title">
        <div className="best-sellers__content">
          <h2 id="best-sellers-title" className="best-sellers__title">
            <span className="best-sellers__title-main">Best Sellers</span>
            <span className="best-sellers__title-sub">
              Discover our
              <br />
              most popular reads
            </span>
          </h2>
          
          <HomeCategoryList />
        </div>
      </section>
    </>
    )
}

export default Home;
