import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookItem } from '../types';

interface CategorySearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredBooks: BookItem[];
  setFilteredBooks: (books: BookItem[]) => void;
  originalBooks: BookItem[];
  setOriginalBooks: (books: BookItem[]) => void;
  performSearch: (term: string, books: BookItem[]) => BookItem[];
  clearSearch: () => void;
}

const CategorySearchContext = createContext<CategorySearchContextType>({
  searchTerm: '',
  setSearchTerm: () => {},
  filteredBooks: [],
  setFilteredBooks: () => {},
  originalBooks: [],
  setOriginalBooks: () => {},
  performSearch: () => [],
  clearSearch: () => {},
});

export const useCategorySearch = () => useContext(CategorySearchContext);

export const CategorySearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<BookItem[]>([]);
  const [originalBooks, setOriginalBooks] = useState<BookItem[]>([]);

  const performSearch = (term: string, books: BookItem[]): BookItem[] => {
    if (!term.trim()) {
      return books;
    }
    
    const normalizedTerm = term.toLowerCase();
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(normalizedTerm) || 
      book.author.toLowerCase().includes(normalizedTerm) ||
      (book.description && book.description.toLowerCase().includes(normalizedTerm))
    );
    
    return filtered;
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredBooks(originalBooks);
  };

  return (
    <CategorySearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filteredBooks,
        setFilteredBooks,
        originalBooks,
        setOriginalBooks,
        performSearch,
        clearSearch,
      }}
    >
      {children}
    </CategorySearchContext.Provider>
  );
};
