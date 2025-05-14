import React, { useContext } from 'react';
import CartTable from './CartTable';
import '../assets/css/Cart.css';
import { CartStore } from '../contexts/CartContext';

function Cart() {
    const { cart } = useContext(CartStore);
    
    return (
        <div className="cart-container">
            <div className="cart-header-section" style={{ marginTop: '30px' }}>
                <h1>Your Shopping Cart</h1>
                {cart.length === 0 && (
                    <p className="empty-cart-message">Your cart is currently empty. Browse our collection to find your next favorite book!</p>
                )}
            </div>
            <CartTable />
        </div>
    );
}

export default Cart;
