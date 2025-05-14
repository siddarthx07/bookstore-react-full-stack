import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OrderDetailsContext } from '../contexts/OrderDetailsContext';
import ConfirmationTable from './ConfirmationTable';
import '../assets/css/Confirmation.css';

function ConfirmationPage() {
    const { orderDetails } = useContext(OrderDetailsContext);
    const navigate = useNavigate();

    // If no order details are available, redirect to home page
    useEffect(() => {
        if (!orderDetails) {
            navigate('/');
        }
    }, [orderDetails, navigate]);

    if (!orderDetails) {
        return <div>Loading...</div>;
    }

    // Format date from timestamp
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    // Format credit card number to show only last 4 digits
    const formatCreditCard = (ccNumber: string) => {
        return `**** **** **** ${ccNumber.slice(-4)}`;
    };

    // Format expiration date from timestamp
    const formatExpirationDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <div className="confirmation-container">
            <div className="confirmation-header">
                <h1>Order Confirmation</h1>
                <div className="confirmation-message">
                    <p>Thank you for your order! Your purchase has been confirmed.</p>
                    <p>You will receive an email with your order details shortly.</p>
                </div>
            </div>

            <div className="confirmation-section">
                <h3>Order Information</h3>
                <div className="confirmation-details">
                    <div className="detail-item">
                        <span className="detail-label">Confirmation Number:</span>
                        <span className="detail-value">{orderDetails.order.confirmationNumber}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Order Date:</span>
                        <span className="detail-value">{formatDate(orderDetails.order.dateCreated)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Order Total:</span>
                        <span className="detail-value">${orderDetails.order.amount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="confirmation-section">
                <h3>Customer Information</h3>
                <div className="confirmation-details">
                    <div className="detail-item">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{orderDetails.customer.customerName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{orderDetails.customer.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{orderDetails.customer.address}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{orderDetails.customer.phone}</span>
                    </div>
                </div>
            </div>

            <div className="confirmation-section">
                <h3>Payment Information</h3>
                <div className="confirmation-details">
                    <div className="detail-item">
                        <span className="detail-label">Credit Card:</span>
                        <span className="detail-value">{formatCreditCard(orderDetails.customer.ccNumber)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Expiration Date:</span>
                        <span className="detail-value">
                            {formatExpirationDate(orderDetails.customer.ccExpDate)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="confirmation-section">
                <h3>Order Details</h3>
                <ConfirmationTable />
            </div>

            <div className="confirmation-actions">
                <Link to="/" className="back-to-home-button">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default ConfirmationPage;
