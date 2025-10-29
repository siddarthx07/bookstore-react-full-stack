import '../assets/css/CategoryBookListItem.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartStore } from '../contexts/CartContext';
import { CartTypes } from '../reducers/CartReducer';
import { asDollarsAndCents } from '../utils';

// Pre-import book images
import acourtofthornsandroses from '../assets/images/books/acourtofthornsandroses.jpg';
import beforeigotosleep from '../assets/images/books/beforeigotosleep.jpg';
import birdbox from '../assets/images/books/birdbox.jpg';
import daydream from '../assets/images/books/daydream.png';
import findingperfect from '../assets/images/books/findingperfect.png';
import houseofleaves from '../assets/images/books/houseofleaves.jpg';
import kingofwrath from '../assets/images/books/kingofwrath.png';
import mexicangothic from '../assets/images/books/mexicangothic.jpg';
import november9 from '../assets/images/books/november9.png';
import reminders from '../assets/images/books/reminders.png';
import remindersofhim from '../assets/images/books/remindersofhim.png';
import shadowandbone from '../assets/images/books/shadowandbone.jpg';
import thechain from '../assets/images/books/thechain.jpg';
import theexorcist from '../assets/images/books/theexorcist.jpg';
import thefriendzone from '../assets/images/books/thefriendzone.png';
import thegirlwiththedragontattoo from '../assets/images/books/thegirlwiththedragontattoo.jpg';
import thenameofthewind from '../assets/images/books/thenameofthewind.jpg';
import theprioryoftheorangetree from '../assets/images/books/theprioryoftheorangetree.jpg';
import theshining from '../assets/images/books/theshining.jpg';
import thesilentpatient from '../assets/images/books/thesilentpatient.jpg';
import thewayofkings from '../assets/images/books/thewayofkings.jpg';
import thewomaninthewindow from '../assets/images/books/thewomaninthewindow.jpg';
import twistedlies from '../assets/images/books/twistedlies.png';
import twistedlove from '../assets/images/books/twistedlove.png';
import verity from '../assets/images/books/verity.png';
import yourfault from '../assets/images/books/yourfault.png';

const bookImages: { [key: string]: string } = {
  'acourtofthornsandroses': acourtofthornsandroses,
  'beforeigotosleep': beforeigotosleep,
  'birdbox': birdbox,
  'daydream': daydream,
  'findingperfect': findingperfect,
  'houseofleaves': houseofleaves,
  'kingofwrath': kingofwrath,
  'mexicangothic': mexicangothic,
  'november9': november9,
  'reminders': reminders,
  'remindersofhim': remindersofhim,
  'shadowandbone': shadowandbone,
  'thechain': thechain,
  'theexorcist': theexorcist,
  'thefriendzone': thefriendzone,
  'thegirlwiththedragontattoo': thegirlwiththedragontattoo,
  'thenameofthewind': thenameofthewind,
  'theprioryoftheorangetree': theprioryoftheorangetree,
  'theshining': theshining,
  'thesilentpatient': thesilentpatient,
  'thewayofkings': thewayofkings,
  'thewomaninthewindow': thewomaninthewindow,
  'twistedlies': twistedlies,
  'twistedlove': twistedlove,
  'verity': verity,
  'yourfault': yourfault
};

type BookItemProps = {
  bookId: number;
  title: string;
  author: string;
  price: number;
  isPublic: boolean;
  rating: number;
  categoryId: number;
};

function CategoryBookListItem({ bookId, title, author, price, rating, categoryId }: BookItemProps) {
    const { dispatch } = useContext(CartStore);
    const [showToast, setShowToast] = useState(false);
    
    const book = { 
        bookId, 
        title, 
        author, 
        description: '', 
        price, 
        rating, 
        isPublic: true, 
        isFeatured: false, 
        categoryId 
    };
    
    // Add a ref to track if we're currently processing a click
    const isAddingRef = useRef(false);
    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const addBookToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // Prevent multiple rapid clicks
        if (isAddingRef.current) return;
        
        isAddingRef.current = true;
        dispatch({ type: CartTypes.ADD, item: book, id: book.bookId });

        // Show toast feedback
        setShowToast(true);
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = setTimeout(() => {
            setShowToast(false);
            toastTimeoutRef.current = null;
        }, 2500);
        
        // Reset after a short delay
        setTimeout(() => {
            isAddingRef.current = false;
        }, 300);
    };
    
    useEffect(() => () => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
    }, []);
  const imageKey = title.toLowerCase().replace(/\s+/g, '');
  const rawSrc = bookImages[imageKey] ?? daydream;
  const imageSrc = rawSrc
    ? rawSrc.startsWith('/') ? rawSrc : `/${rawSrc.replace(/^\//, '')}`
    : '/static/media/default-book-cover.jpg';
  
  return (
    <article className="book-card" key={bookId}>
      {showToast && (
        <div className="book-card__toast" role="status" aria-live="polite">
          ✓ Added to cart
        </div>
      )}
      <div className="book-card__image-container">
        <img 
          src={imageSrc}
          alt={`Cover of ${title}`} 
          className="book-card__image" 
        />
        <Link
          to={`/book/${bookId}`}
          className="book-card__read-now"
          aria-label={`View details for ${title}`}
        >
          View Details
        </Link>
      </div>
      <div className="book-card__info">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">by {author}</p>
        <div className="book-card__rating">
          <span className="book-card__rating-label">Rating:</span>
          <span className="book-card__stars" aria-label={`${rating} out of 5 stars`}>★★★★★</span>
        </div>
        <p className="book-card__price">{asDollarsAndCents(price * 100)}</p>
        <button className="book-card__add-to-cart" onClick={addBookToCart} aria-label={`Add ${title} to cart`}>Add to Cart</button>
      </div>
    </article>
  );
}

export default CategoryBookListItem;
