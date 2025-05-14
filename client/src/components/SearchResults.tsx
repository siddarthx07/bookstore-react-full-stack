import React from 'react';
import { useSearch } from '../contexts/SearchContext';
import CategoryBookListItem from './CategoryBookListItem';
import '../assets/css/BookGrid.css';
import '../assets/css/SearchResults.css';
import { useNavigate } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const { searchTerm, searchResults, isSearching, clearSearch } = useSearch();
  const navigate = useNavigate();
  
  // Handle going back to previous page
  const handleBack = () => {
    clearSearch();
    navigate(-1);
  };

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
        <h1>Search Results for "{searchTerm}"</h1>
        <p>{searchResults.length} results found</p>
      </div>

      {isSearching && searchResults.length === 0 ? (
        <div className="no-results">
          <p>Searching...</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="no-results">
          <p>No books found matching "{searchTerm}"</p>
          <p>Try a different search term or browse our categories.</p>
        </div>
      ) : (
        <main className="book-grid">
          {searchResults.map((book) => (
            <CategoryBookListItem key={book.bookId} {...book} />
          ))}
        </main>
      )}
    </div>
  );
};

export default SearchResults;
