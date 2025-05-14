import { useLocation, Outlet } from "react-router-dom";
import { useContext } from 'react';
import AppHeader from "./components/AppHeader";
import CategoryHeader from "./components/CategoryHeader";
import AppFooter from "./components/AppFooter";
import { Category } from './contexts/CategoryContext';
import './assets/css/AppLayout.css';

function AppLayout() {
  const location = useLocation();
  const isCategoryPage = location.pathname.startsWith("/categories");
  const isCartPage = location.pathname.startsWith("/cart");
  const isCheckoutPage = location.pathname.startsWith("/checkout");
  const isConfirmationPage = location.pathname.startsWith("/confirmation");

  return (
    <div className="app-layout">
      {isCategoryPage || isCartPage || isCheckoutPage || isConfirmationPage ? <CategoryHeader /> : <AppHeader />}  {/* Show CategoryHeader on category, cart, checkout, and confirmation pages */}
      <main className="app-content">
        <Outlet />  {/* Renders the matched route's component */}
      </main>
      <AppFooter />
    </div>
  );
}

// Ensure this is recognized as a module
export default AppLayout;
export {};
