import React, { useContext, useState } from 'react';
import "../assets/css/CategoryHeader.css";
import "../assets/css/CategorySearch.css";
import HeaderDropdown from './HeaderDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { CartStore } from '../contexts/CartContext';
import { useCategorySearch } from '../contexts/CategorySearchContext';
import { useAuth } from '../contexts/AuthContext';

const CategoryHeader: React.FC = () => {
  const { cart } = useContext(CartStore);
  const { searchTerm, setSearchTerm, performSearch, originalBooks, setFilteredBooks, clearSearch } = useCategorySearch();
  const [inputValue, setInputValue] = useState(searchTerm);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Calculate total quantity of items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
    const filtered = performSearch(value, originalBooks);
    setFilteredBooks(filtered);
  };
  
  const handleClearSearch = () => {
    setInputValue('');
    clearSearch();
  };
  const firstName = user ? user.fullName.split(' ')[0] : '';

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={require('../assets/images/site/Logo.png')}  alt="Storyspark Logo" className="logo-image" />
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
        <img src={require('../assets/images/site/filter.png')}  alt="Filter" className="filter-icon" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search books..." 
          value={inputValue}
          onChange={handleSearchChange}
        />
        {inputValue && (
          <button className="search-clear" onClick={handleClearSearch}>
            ✕
          </button>
        )}
        <img src={require('../assets/images/site/search-glass.png')}  alt="Search" className="search-icon" />
      </div>
      <HeaderDropdown />
      <div className="nav-controls">
        {user ? (
          <div className="auth-chip auth-chip--stacked">
            <div className="chip-top">
              <img src={require('../assets/images/site/ion_person.png')}  alt="Profile" className="profile-icon" />
              <span className="greeting-text">Hi, {firstName}</span>
            </div>
            <button type="button" className="chip-action" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="auth-chip auth-chip--stacked">
            <div className="chip-top">
              <img src={require('../assets/images/site/ion_person.png')}  alt="Profile" className="profile-icon" />
              <Link to="/signin" className="chip-link">Sign In</Link>
            </div>
            <Link to="/signup" className="chip-subtle">Create account</Link>
          </div>
        )}
      </div>
      <Link to="/cart" aria-label="Shopping cart" style={{ marginLeft: 'auto' }}>
          <div className="cart-container">
            <img src={require('../assets/images/site/cart.png')} alt="Cart" className="cart-icon" />
            <span className="cart-badge">{cartItemCount}</span>
          </div>
        </Link>
    </header>
  );
};

export default CategoryHeader;
