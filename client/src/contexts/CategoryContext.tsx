import { createContext, useState, useEffect, ReactNode } from 'react';
import { CategoryItem } from '../types';
import apiClient from '../apiClient';

export const Category = createContext<CategoryItem[]>([]);
Category.displayName = 'CategoryContext';

interface CategoryContextProps {
  children: ReactNode;
}

function CategoryContext({ children }: CategoryContextProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    apiClient.get('/categories')
      .then((result) => setCategories(result.data as CategoryItem[]))
      .catch(console.error);
  }, []);

  return (
    <Category.Provider value={categories}>{children}</Category.Provider>
  );
}

export default CategoryContext;
