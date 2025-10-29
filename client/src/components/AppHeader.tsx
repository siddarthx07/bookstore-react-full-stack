import { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import HeaderDropdown from './HeaderDropdown';
import '../assets/css/global.css'
import '../assets/css/AppHeader.css';
import '../assets/css/HeaderSpacing.css';
import { CartStore } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function AppHeader() {
  const { cart } = useContext(CartStore);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const showSearch = location.pathname !== "/";
  
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const firstName = user ? user.fullName.split(' ')[0] : '';

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

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
    {showSearch ? (
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
    ) : (
      <div className="search-placeholder" />
    )}

    <HeaderDropdown />
    <div className="nav-controls">
        <div className="auth-chip">
          <img 
            src={require('../assets/images/site/ion_person.png')} 
            alt="Profile" 
            className="profile-icon" 
          />
          {user ? (
            <>
              <span className="greeting-text">Hi, {firstName}</span>
              <button type="button" className="chip-action" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="chip-link">Sign In</Link>
            </>
          )}
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
