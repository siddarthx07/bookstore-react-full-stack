import Home from './components/Home'
import AppLayout from "./AppLayout";
import CategoryBookList from './components/CategoryBookList';
import Cart from './components/Cart';
import CheckoutPage from './components/CheckoutPage';
import ConfirmationPage from './components/ConfirmationPage';
import BookDetail from './components/BookDetail';
import { OrderDetailsProvider } from './contexts/OrderDetailsContext';
import { CategorySearchProvider } from './contexts/CategorySearchContext';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"



// Instead of using future flags (which might not be available in the current version),
// let's use the original Router approach but with a comment explaining the warnings
// When upgrading to React Router v7, we can add the future flags

function App() {
  // Note: When upgrading to React Router v7, consider using createBrowserRouter with:
  // future: { v7_startTransition: true, v7_relativeSplatPath: true }
  return (
    <AuthProvider>
      <CategorySearchProvider>
        <OrderDetailsProvider>
          <Router>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/book/:bookId" element={<BookDetail />} />
                <Route path="/categories" element={<CategoryBookList />}>
                  <Route path=":id" element={<CategoryBookList />} />
                </Route>
                <Route path="/cart" element={<Cart />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <CheckoutPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/confirmation"
                  element={
                    <RequireAuth>
                      <ConfirmationPage />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<div>Page Not Found</div>} />
              </Route>
            </Routes>
          </Router>
        </OrderDetailsProvider>
      </CategorySearchProvider>
    </AuthProvider>
  );
}

export default App;
