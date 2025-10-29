import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookItem } from '../types';
import apiClient from '../apiClient';
import { CartStore } from '../contexts/CartContext';
import { CartTypes } from '../reducers/CartReducer';
import { asDollarsAndCents } from '../utils';
import '../assets/css/BookDetail.css';

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
  const bookImage = bookImages[imageKey];

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
          </div>
        </div>

        {/* Right Column - Book Info */}
        <div className="book-detail-info-section">
          <h1 className="book-detail-title">{book.title}</h1>
          <p className="book-detail-author">by {book.author}</p>
          
          <div className="book-detail-rating">
            <span className="book-detail-stars">★★★★★</span>
            <span className="book-detail-rating-text">5.0</span>
          </div>

          <div className="book-detail-price">
            {asDollarsAndCents(book.price * 100)}
          </div>

          <div className="book-detail-meta">
            <span className="meta-item">📚 Romance</span>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="book-detail-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
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

          {/* Description Section */}
          <div className="book-detail-description">
            <h2 className="section-title">About This Book</h2>
            <p className="description-text">{book.description}</p>
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
