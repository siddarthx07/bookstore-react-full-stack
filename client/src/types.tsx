// Contains all the custom types we want to use for our application
import Fantasy from './assets/images/categories/fantasy.jpg';
import Romance from './assets/images/categories/romance.jpg';
import Thriller from './assets/images/categories/thriller.jpg';
import Horror from './assets/images/categories/horrror.jpg';

//this interface represents the books in our bookstore
export interface BookItem {
  bookId: number;
  title: string;
  author: string;
  price: number;
  isPublic: boolean;
  rating: number;
  categoryId: number;
  description?: string; // Optional description field for search
}

export interface CategoryItem {
  categoryId: number;
  name: string;
}
export const categoryImages: Record<string, any> = {
  thriller: Thriller,
  fantasy: Fantasy,
  horror: Horror,
  romance: Romance
};

//this class represents the items(books) in our shopping cart
export class ShoppingCartItem {
  id: number;
  book: BookItem;
  quantity: number;

  constructor(theBook: BookItem) {
    this.id = theBook.bookId;
    this.book = theBook;
    this.quantity = 1;
  }
}
// this is used by the reducer. You can define it on the CartReducer
export const initialCartState:ShoppingCartItem[] =  [];

// Customer form data for checkout
export interface CustomerForm {
  name: string;
  address: string;
  phone: string;
  email: string;
  ccNumber: string;
  ccExpiryMonth: number;
  ccExpiryYear: number;
}

export interface Order {
  orderId: number;
  amount: number;
  dateCreated: number;
  confirmationNumber: number;
  customerId: number;
}

export interface LineItem {
  bookId: number;
  orderId: number;
  quantity: number;
}

export interface Customer {
  customerName: string;
  address: string;
  phone: string;
  email: string;
  ccNumber: string;
  ccExpDate: number;
}

export interface OrderDetails {
  order: Order;
  customer: Customer;
  books: BookItem[];
  lineItems: LineItem[];
}

export interface ServerErrorResponse {
  reason: string;
  message: string;
  fieldName: string;
  error: boolean;
}

// Months for credit card expiration
export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Years for credit card expiration
export const years = Array.from({length: 15}, (_, i) => new Date().getFullYear() + i);
