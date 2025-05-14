import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { CategoryItem } from '../types';

export const Category = createContext<CategoryItem[]>([]);
Category.displayName = 'CategoryContext';

interface CategoryContextProps {
  children: ReactNode;
}

function CategoryContext({ children }: CategoryContextProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    axios.get('/SiddarthBookstoreReactTransact/api/categories')
      .then((result) => setCategories(result.data as CategoryItem[]))
      .catch(console.error);
  }, []);

  return (
    <Category.Provider value={categories}>{children}</Category.Provider>
  );
}

export default CategoryContext;
