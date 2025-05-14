import AppHeader from './components/AppHeader';
import Home from './components/Home'
import AppLayout from "./AppLayout";
import CategoryBookList from './components/CategoryBookList';
import Cart from './components/Cart';
import CheckoutPage from './components/CheckoutPage';
import ConfirmationPage from './components/ConfirmationPage';
import { OrderDetailsProvider } from './contexts/OrderDetailsContext';
import { CategorySearchProvider } from './contexts/CategorySearchContext';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"



// Instead of using future flags (which might not be available in the current version),
// let's use the original Router approach but with a comment explaining the warnings
// When upgrading to React Router v7, we can add the future flags

function App() {
  // Note: When upgrading to React Router v7, consider using createBrowserRouter with:
  // future: { v7_startTransition: true, v7_relativeSplatPath: true }
  return (
    <CategorySearchProvider>
      <OrderDetailsProvider>
      <Router basename="/SiddarthBookstoreReactTransact">
        <Routes>
          <Route element={<AppLayout />}> 
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoryBookList />}>
              <Route path=":id" element={<CategoryBookList />} />
            </Route>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>
        </Routes>
      </Router>
    </OrderDetailsProvider>
    </CategorySearchProvider>
  );
}

export default App;

