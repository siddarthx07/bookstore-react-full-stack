import { useContext } from 'react';
import HeaderDropdown from './HeaderDropdown';
import '../assets/css/global.css'
import '../assets/css/AppHeader.css';
import '../assets/css/HeaderSpacing.css';
import { Link } from 'react-router-dom';
import { Category } from '../contexts/CategoryContext';
import { CartStore } from '../contexts/CartContext';

function AppHeader() {
  const categories = useContext(Category);
  const { cart } = useContext(CartStore);
  
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
return(
<header className="header">
    <div className="logo-container">
        <Link to="/" className="logo-link">
            <img 
                src={require('../assets/images/site/Logo.png')} 
                alt="Storyspark Logo" 
                className="logo-image" 
            />
            <div className="logo">
                <div className="logo-letter">S</div>
                <div className="logo-text-container">
                    <div className="logo-text-top">tory</div>
                    <div className="logo-text-bottom">park</div>
                </div>
            </div>
        </Link>
    </div>
    <div className="search-container">
        <img 
            src={require('../assets/images/site/filter.png')} 
            alt="Filter" 
            className="filter-icon" 
        />
        <input 
            type="text" 
            className="search-input" 
            placeholder="Search..." 
            disabled
        />
        <img 
            src={require('../assets/images/site/search-glass.png')} 
            alt="Search" 
            className="search-icon" 
        />
    </div>

    <HeaderDropdown />
    <div className="nav-controls">
        <div className="sign-in">
            <a href="#" className="sign-in-link">Sign In</a>
            <img 
                src={require('../assets/images/site/ion_person.png')} 
                alt="Sign In" 
                className="profile-icon" 
            />    
        </div>
    </div>
    <Link to="/cart" aria-label="Shopping cart" style={{ marginLeft: 'auto' }}>
        <div className="cart-container">
            <img 
                src={require('../assets/images/site/cart.png')} 
                alt="Cart" 
                className="cart-icon" 
            />
            <span className="cart-badge">{cartQuantity}</span>
        </div>
    </Link>
</header>
)
}
export default AppHeader;

