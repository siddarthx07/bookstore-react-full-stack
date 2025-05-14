import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/css/CategoryNav.css';
import '../assets/css/global.css';
import { Category } from '../contexts/CategoryContext';

function CategoryNav() {
  const categories = useContext(Category);
  const navigate = useNavigate(); // Use React Router for navigation
  const { id } = useParams(); // Get category from URL
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Update active category when URL parameter changes
  useEffect(() => {
    if (id && categories.length > 0) {
      // Find the category that matches the URL parameter
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === id.toLowerCase()
      );
      if (category) {
        setActiveCategory(category.categoryId);
      }
    }
  }, [id, categories]);

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    setActiveCategory(categoryId);
    navigate(`/categories/${categoryName.toLowerCase()}`); // Navigate to category page
  };

  return (
    <nav className="category-nav" aria-label="Book Categories">
      <ul className="category-buttons">
        {categories.map((category) => (
          <li key={category.categoryId}>
            <button
              className={`category-item ${activeCategory === category.categoryId ? 'category-item-active' : ''}`}
              tabIndex={0}
              onClick={() => handleCategoryClick(category.categoryId, category.name)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default CategoryNav;
