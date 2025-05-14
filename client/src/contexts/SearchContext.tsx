import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { BookItem } from '../types';
import axios from 'axios';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: BookItem[];
  isSearching: boolean;
  performSearch: (term: string) => void;
  clearSearch: () => void;
}

// Create the context with a default value
export const SearchContext = createContext<SearchContextType>({
  searchTerm: '',
  setSearchTerm: () => {},
  searchResults: [],
  isSearching: false,
  performSearch: () => {},
  clearSearch: () => {},
});

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<BookItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allBooks, setAllBooks] = useState<BookItem[]>([]);

  // Load all books data on initial mount
  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        // Fetch books from each category to create a complete catalog
        const categories = ['romance', 'fantasy', 'thriller', 'horror'];
        const booksPromises = categories.map(category => 
          axios.get(`/SiddarthBookstoreReactTransact/api/categories/name/${category}/books`)
        );
        
        const responses = await Promise.all(booksPromises);
        
        // Combine all books, removing duplicates by bookId
        const allBooksWithDuplicates = responses.flatMap(response => response.data as BookItem[]);
        const uniqueBooks = Array.from(
          new Map(allBooksWithDuplicates.map(book => [book.bookId, book])).values()
        );
        
        setAllBooks(uniqueBooks);
      } catch (error) {
        console.error('Error fetching all books:', error);
      }
    };

    fetchAllBooks();
  }, []);

  // Perform search without making API calls
  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const normalizedTerm = term.toLowerCase();
    
    // Search through all books
    const filteredBooks = allBooks.filter(book => 
      book.title.toLowerCase().includes(normalizedTerm) || 
      book.author.toLowerCase().includes(normalizedTerm) ||
      (book.description && book.description.toLowerCase().includes(normalizedTerm))
    );
    
    setSearchResults(filteredBooks);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <SearchContext.Provider 
      value={{ 
        searchTerm, 
        setSearchTerm, 
        searchResults, 
        isSearching, 
        performSearch,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for using search context
export const useSearch = () => useContext(SearchContext);
