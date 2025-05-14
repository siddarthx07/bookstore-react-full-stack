import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Checkout.css';

function Checkout() {
    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <div className="checkout-message">
                <p>Thank you for shopping with us! The checkout functionality will be implemented in the next project.</p>
            </div>
            <div className="checkout-actions">
                <Link to="/cart" className="back-to-cart-button">
                    Back to Cart
                </Link>
            </div>
        </div>
    );
}

export default Checkout;
