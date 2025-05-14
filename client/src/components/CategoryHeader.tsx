import React, { useContext, useState } from 'react';
import "../assets/css/CategoryHeader.css";
import "../assets/css/CategorySearch.css";
import HeaderDropdown from './HeaderDropdown';
import { Link } from 'react-router-dom';
import { Category } from '../contexts/CategoryContext';
import { CartStore } from '../contexts/CartContext';
import { useCategorySearch } from '../contexts/CategorySearchContext';

const CategoryHeader: React.FC = () => {
  const categories = useContext(Category);
  const { cart } = useContext(CartStore);
  const { searchTerm, setSearchTerm, performSearch, originalBooks, setFilteredBooks, clearSearch } = useCategorySearch();
  const [inputValue, setInputValue] = useState(searchTerm);
  
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
        <div className="user-profile">
          <div className="profile-line">
            <span className="greeting">Hello, Bandi</span>
            <img src={require('../assets/images/site/ion_person.png')}  alt="Profile" className="profile-icon" />
          </div>
          <div className="profile-line">
            <a href="#" className="sign-out">Sign out</a>
            <img src={require('../assets/images/site/uil_signout.png')}  alt="Sign out" className="profile-icon" />
          </div>
        </div>
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