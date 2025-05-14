import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CategoryNav from './CategoryNav';
import CategoryBookListItem from './CategoryBookListItem';
import '../assets/css/BookGrid.css';
import '../assets/css/CategoryBookCard.css';
import '../assets/css/CategoryBookList.css'; 
import { Category } from '../contexts/CategoryContext';
import { CartStore } from '../contexts/CartContext';
import { useCategorySearch } from '../contexts/CategorySearchContext';
import { BookItem } from '../types';

interface Book extends BookItem {
  categoryId: number;
}

function CategoryBookList() {
  const categories = useContext(Category);
  const { setLastVisitedCategory } = useContext(CartStore);
  const { searchTerm, filteredBooks, setFilteredBooks, setOriginalBooks } = useCategorySearch();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Get category from URL

  useEffect(() => {
    let mounted = true;

    const fetchBooks = async () => {
      if (!id) return;
      
      // Save the current category as the last visited category
      setLastVisitedCategory(id);

      try {
        setLoading(true);
        setError(null);
        const result = await axios.get(`/SiddarthBookstoreReactTransact/api/categories/name/${id.toLowerCase()}/books`);
        if (mounted) {
          const fetchedBooks = result.data as Book[];
          setBooks(fetchedBooks);
          setOriginalBooks(fetchedBooks);
          setFilteredBooks(fetchedBooks);
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
  }, [id]); // Only re-run when category id changes

  // Determine which books to display based on search term
  const displayBooks = searchTerm ? filteredBooks : books;

  return (
    <>
      <CategoryNav />
      <main className="book-grid">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && displayBooks.length === 0 && searchTerm && (
          <div className="no-results">No books found matching "{searchTerm}"</div>
        )}
        {!loading && !error && displayBooks && displayBooks.map((book) => (
          <CategoryBookListItem key={book.bookId} {...book} />
        ))}
      </main>
    </>
  );
}

export default CategoryBookList;
