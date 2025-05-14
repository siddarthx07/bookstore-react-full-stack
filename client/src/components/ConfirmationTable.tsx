import React, { useContext } from 'react';
import { OrderDetailsContext } from '../contexts/OrderDetailsContext';
import { asDollarsAndCents } from '../utils';
import '../assets/css/Confirmation.css';

const ConfirmationTable: React.FC = () => {
  const { orderDetails } = useContext(OrderDetailsContext);

  if (!orderDetails) {
    return <div>No order details available</div>;
  }

  // Function to find quantity for a book
  const getQuantityForBook = (bookId: number): number => {
    const lineItem = orderDetails.lineItems.find(item => item.bookId === bookId);
    return lineItem ? lineItem.quantity : 0;
  };

  // Calculate subtotal in cents
  const subtotalCents = orderDetails.books.reduce((acc, book) => {
    const quantity = getQuantityForBook(book.bookId);
    return acc + (quantity * book.price * 100);
  }, 0);

  // Calculate tax and total in cents
  const taxCents = Math.round(subtotalCents * 0.06);
  const totalCents = subtotalCents + taxCents;

  return (
    <div className="confirmation-table-container">
      <table className="confirmation-table">
        <thead>
          <tr>
            <th className="text-left">Book Title</th>
            <th className="text-center">Quantity</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.books.map((book, index) => {
            // Find the quantity from the line items
            const quantity = getQuantityForBook(book.bookId);
            const subtotal = book.price * quantity;
            
            return (
              <tr key={book.bookId}>
                <td className="text-left">{book.title}</td>
                <td className="text-center">{quantity}</td>
                <td className="text-right">{asDollarsAndCents(book.price * 100)}</td>
                <td className="text-right">{asDollarsAndCents(subtotal * 100)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-right">Subtotal:</td>
            <td className="text-right">{asDollarsAndCents(subtotalCents)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-right">Tax (6%):</td>
            <td className="text-right">{asDollarsAndCents(taxCents)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-right"><strong>Total:</strong></td>
            <td className="text-right"><strong>{asDollarsAndCents(totalCents)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ConfirmationTable;
