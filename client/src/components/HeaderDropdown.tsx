import '../assets/css/global.css';
import '../assets/css/HeaderDropdown.css';
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from '../contexts/CategoryContext';

function HeaderDropdown() {
  const categories = useContext(Category);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/categories/${categoryName.toLowerCase()}`);
    setIsOpen(false);
  };

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="category-link" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="category-trigger">
        Categories
        <span className="caret-down"></span>
      </div>
      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        {categories.map((item) => (
          <button 
            key={item.categoryId} 
            onClick={() => handleCategoryClick(item.name)}
            className="dropdown-item"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HeaderDropdown;
