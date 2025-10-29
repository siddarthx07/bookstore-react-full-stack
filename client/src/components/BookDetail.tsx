import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookItem } from '../types';
import apiClient from '../apiClient';
import { CartStore } from '../contexts/CartContext';
import { CartTypes } from '../reducers/CartReducer';
import { asDollarsAndCents } from '../utils';
import '../assets/css/BookDetail.css';
import { Category as CategoryContext } from '../contexts/CategoryContext';

// Pre-import book images
import twistedLove from '../assets/images/books/twistedlove.png';
import theFriendZone from '../assets/images/books/thefriendzone.png';
import remindersOfHim from '../assets/images/books/remindersofhim.png';
import november9 from '../assets/images/books/november9.png';
import kingOfWrath from '../assets/images/books/kingofwrath.png';
import twistedLies from '../assets/images/books/twistedlies.png';
import yourFault from '../assets/images/books/yourfault.png';
import findingPerfect from '../assets/images/books/findingperfect.png';

const bookImages: { [key: string]: string } = {
  'twistedlove': twistedLove,
  'thefriendzone': theFriendZone,
  'remindersofhim': remindersOfHim,
  'november9': november9,
  'kingofwrath': kingOfWrath,
  'twistedlies': twistedLies,
  'yourfault': yourFault,
  'findingperfect': findingPerfect
};

function BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { dispatch } = useContext(CartStore);
  const categories = useContext(CategoryContext);
  
  const [book, setBook] = useState<BookItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/books/${bookId}`);
        setBook(response.data as BookItem);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to load book details');
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const handleAddToCart = () => {
    if (book) {
      // Add the specified quantity to cart
      for (let i = 0; i < quantity; i++) {
        dispatch({ type: CartTypes.ADD, item: book, id: book.bookId });
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return (
      <div className="book-detail-container">
        <div className="loading-message">Loading book details...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-container">
        <div className="error-message">
          <h2>Book Not Found</h2>
          <p>{error || 'The book you are looking for does not exist.'}</p>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    );
  }

  const imageKey = book.title.toLowerCase().replace(/\s+/g, '');
  const bookImage = bookImages[imageKey] ?? 'https://placehold.co/360x540?text=StorySpark';
  const categoryMatch = categories.find((category) => category.categoryId === book.categoryId);
  const categoryName = categoryMatch?.name ?? 'General';

  const ratingValue = book.rating ?? 0;
  const clampedRating = Math.max(0, Math.min(5, ratingValue));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - fullStars >= 0.5;
  const availabilityLabel = book.isPublic ? 'In Stock' : 'Unavailable';
  const availabilityTone = book.isPublic ? 'positive' : 'warning';

  return (
    <div className="book-detail-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{book.title}</span>
      </nav>

      {/* Success Message */}
      {addedToCart && (
        <div className="success-toast">
          ✓ Added to cart successfully!
        </div>
      )}

      <div className="book-detail-card">
        {/* Main Content */}
        <div className="book-detail-content">
          {/* Left Column - Book Image */}
          <div className="book-detail-image-section">
            <div className="book-detail-image-container">
              <img 
                src={bookImage} 
                alt={`Cover of ${book.title}`}
                className="book-detail-image"
              />
              {book.isFeatured && (
                <span className="book-detail-badge">Staff Pick</span>
              )}
            </div>
          </div>

          {/* Right Column - Book Info */}
          <div className="book-detail-info-section">
            <div className="book-detail-header">
              <h1 className="book-detail-title">{book.title}</h1>
              <p className="book-detail-author">by {book.author}</p>
            </div>
          
            <div className="book-detail-meta-grid">
              <div className="meta-card">
                <span className="meta-label">Rating</span>
                <div className="meta-value rating">
                  {[...Array(5)].map((_, index) => {
                    if (index < fullStars) {
                      return <span key={index}>★</span>;
                    }
                    if (index === fullStars && hasHalfStar) {
                      return <span key={index} className="half-star">★</span>;
                    }
                    return <span key={index} className="star-muted">★</span>;
                  })}
                  <span className="rating-number">{clampedRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="meta-card">
                <span className="meta-label">Category</span>
                <span className="meta-value">{categoryName}</span>
              </div>
              <div className="meta-card">
                <span className="meta-label">Availability</span>
                <span className={`meta-value status-${availabilityTone}`}>{availabilityLabel}</span>
              </div>
            </div>

            <div className="book-detail-price-pill">
              <span className="price-amount">{asDollarsAndCents(book.price * 100)}</span>
              <span className="price-caption">Free shipping on orders over $35</span>
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="book-detail-actions">
              <div className="quantity-selector">
                <span className="quantity-label">Quantity</span>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn" 
                    onClick={decrementQuantity}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    className="quantity-btn" 
                    onClick={incrementQuantity}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>

            <div className="book-detail-supporting">
              <div className="supporting-item">
                <span className="supporting-icon">🚚</span>
                <div>
                  <span className="supporting-title">Fast delivery</span>
                  <span className="supporting-copy">Dispatches within 24 hours</span>
                </div>
              </div>
              <div className="supporting-item">
                <span className="supporting-icon">🔒</span>
                <div>
                  <span className="supporting-title">Secure checkout</span>
                  <span className="supporting-copy">SSL encrypted &amp; protected</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="book-detail-description">
              <h2 className="section-title">About This Book</h2>
              <p className="description-text">{book.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="book-detail-footer">
        <button 
          className="back-to-home-btn"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default BookDetail;
