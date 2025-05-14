import '../assets/css/HomeCategoryList.css';
import '../assets/css/BookCard.css';
import '../assets/css/BookGrid.css';
import '../assets/css/HomeBookCard.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BookItem } from '../types';
import { Category } from '../contexts/CategoryContext';

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



function HomeCategoryList() {
  const categories = useContext(Category);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await axios.get('/SiddarthBookstoreReactTransact/api/categories/name/romance/books');
        if (mounted) {
          setBooks(result.data as BookItem[]);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError('Failed to load books');
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      mounted = false;
    };
  }, []); // Only fetch once when component mounts

  if (loading) {
    return <div>Loading...</div>;
  }
    
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="best-sellers__grid">
      {books && books.slice(0, 4).map((book) => (
        <article className="book-card" key={book.bookId}>
          <div className="book-card__image-container">
            <img 
              src={bookImages[book.title.toLowerCase().replace(/\s+/g, '')] || `../assets/images/books/${book.title.toLowerCase().replace(/\s+/g, '')}.jpg`}
              alt={`Cover of ${book.title}`} 
              className="book-card__image" 
            />
          </div>
          <div className="book-card__info">
            <h3 className="book-card__title">{book.title}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}

export default HomeCategoryList;
