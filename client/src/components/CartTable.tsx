import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartStore } from '../contexts/CartContext';
import { CartTypes } from '../reducers/CartReducer';
import '../assets/css/CartTable.css';
import { asDollarsAndCents } from '../utils';

// Import book images or use a helper function to get them
const getBookImage = (bookId: number, title: string) => {
    // Convert title to lowercase and remove spaces for image filename
    const imageKey = title.toLowerCase().replace(/\s+/g, '');
    
    try {
        // Try to require the image dynamically
        return require(`../assets/images/books/${imageKey}.jpg`);
    } catch (e) {
        try {
            // Try with .png extension if .jpg fails
            return require(`../assets/images/books/${imageKey}.png`);
        } catch (e) {
            // Return a placeholder if both fail
            return require('../assets/images/books/reminders.png'); // Using a known image as fallback
        }
    }
};

function CartTable() {
    const { cart, dispatch, lastVisitedCategory } = useContext(CartStore);
    const navigate = useNavigate();
    
    // Handle decrement quantity (remove one item)
    const handleRemoveFromCart = (id: number) => {
        const itemToRemove = cart.find(item => item.id === id);
        if (itemToRemove) {
            dispatch({
                type: CartTypes.REMOVE,
                id,
                item: itemToRemove.book
            });
        }
    };
    
    // Handle increment quantity (add one item)
    const handleAddToCart = (id: number) => {
        const itemToAdd = cart.find(item => item.id === id);
        if (itemToAdd) {
            dispatch({
                type: CartTypes.ADD,
                id,
                item: itemToAdd.book
            });
        }
    };

    const handleClearCart = () => {
        // We need a dummy book item for the CLEAR action
        // The actual item doesn't matter for CLEAR
        if (cart.length > 0) {
            dispatch({
                type: CartTypes.CLEAR,
                id: 0,
                item: cart[0].book
            });
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.book.price * item.quantity);
        }, 0);
    };
    
    // Get total number of items in cart
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };
    
    // Navigate to continue shopping - go to the last visited category
    const handleContinueShopping = () => {
        // Navigate to the last visited category or default to fantasy
        navigate(`/categories/${lastVisitedCategory || 'fantasy'}`);
    };

    return (
        <div className="cart-table-container">
            {cart.length === 0 ? (
                <div className="empty-cart-container">
                    <div className="empty-cart-message">
                        <i className="fas fa-shopping-cart empty-cart-icon"></i>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any books to your cart yet.</p>
                    </div>
                    <button 
                        className="continue-shopping-button empty-cart-button"
                        onClick={handleContinueShopping}
                    >
                        <i className="fas fa-arrow-left"></i> Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-sidebar">
                        <div className="cart-summary">
                            <div className="cart-total">
                                <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}): <span className="cart-total-price">{asDollarsAndCents(calculateTotal() * 100)}</span></span>
                            </div>
                            <div className="cart-actions">
                                <button 
                                    className="continue-shopping-button"
                                    onClick={handleContinueShopping}
                                >
                                    <i className="fas fa-arrow-left"></i> Continue Shopping
                                </button>
                                <Link to="/checkout" className="checkout-button">
                                    <i className="fas fa-shopping-cart"></i> Proceed to Checkout
                                </Link>
                                <button 
                                    className="clear-cart-button"
                                    onClick={handleClearCart}
                                >
                                    <i className="fas fa-trash"></i> Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="cart-main-content">
                        <div className="cart-info">
                            <p>You have <span className="cart-info-highlight">{getTotalItems()}</span> {getTotalItems() === 1 ? 'item' : 'items'} in your cart</p>
                        </div>
                        
                        <div className="cart-grid">
                            <div className="cart-header">Book</div>
                            <div className="cart-header">Title</div>
                            <div className="cart-header cart-price-header">Price</div>
                            <div className="cart-header">Quantity</div>
                            <div className="cart-header cart-subtotal-header">Subtotal</div>
                            <div className="cart-header">Actions</div>

                            {cart.map(item => (
                                <React.Fragment key={item.id}>
                                    <div className="cart-cell cart-image-cell">
                                        <img 
                                            src={getBookImage(item.book.bookId, item.book.title)} 
                                            alt={item.book.title} 
                                            className="cart-book-image" 
                                        />
                                    </div>
                                    <div className="cart-cell cart-title-cell">
                                        <div className="book-title">{item.book.title}</div>
                                        <div className="book-author">by {item.book.author}</div>
                                    </div>
                                    <div className="cart-cell cart-price-cell">
                                        {asDollarsAndCents(item.book.price * 100)}
                                    </div>
                                    <div className="cart-cell cart-quantity-cell">
                                        <div className="quantity-control">
                                            <button 
                                                className="quantity-btn dec-btn" 
                                                onClick={() => handleRemoveFromCart(item.id)}
                                                aria-label="Decrease quantity"
                                                disabled={item.quantity <= 1}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button 
                                                className="quantity-btn inc-btn" 
                                                onClick={() => handleAddToCart(item.id)}
                                                aria-label="Increase quantity"
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-cell cart-subtotal-cell">
                                        {asDollarsAndCents(item.book.price * item.quantity * 100)}
                                    </div>
                                    <div className="cart-cell cart-actions-cell">
                                        <button 
                                            className="remove-item-button"
                                            onClick={() => {
                                                // Remove all quantities of this item
                                                for (let i = 0; i < item.quantity; i++) {
                                                    handleRemoveFromCart(item.id);
                                                }
                                            }}
                                            title="Remove from cart"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartTable;
