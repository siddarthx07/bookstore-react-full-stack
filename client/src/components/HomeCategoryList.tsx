import '../assets/css/HomeCategoryList.css';
import '../assets/css/BookCard.css';
import '../assets/css/BookGrid.css';
import '../assets/css/HomeBookCard.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookItem } from '../types';
import apiClient from '../apiClient';
import bookImages from '../assets/bookImages';
import daydream from '../assets/images/books/daydream.png';


function HomeCategoryList() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.get('/categories/name/romance/books');
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
        <Link to={`/book/${book.bookId}`} key={book.bookId} className="book-card-link">
          <article className="book-card">
            <div className="book-card__image-container">
              <img 
                src={bookImages[book.title.toLowerCase().replace(/[^a-z0-9]/g, '')] ?? daydream}
                alt={`Cover of ${book.title}`} 
                className="book-card__image" 
              />
            </div>
            <div className="book-card__info">
              <h3 className="book-card__title">{book.title}</h3>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

export default HomeCategoryList;
