# Bookstore-React-Full-Stack
A comprehensive full-stack bookstore application with React frontend and Java backend featuring category browsing, shopping cart functionality, user authentication, order processing, and a responsive UI. Built with React, TypeScript, Java, and RESTful API architecture.

# Siddarth's Bookstore Application

A complete full-stack e-commerce bookstore application built with React frontend and Java RESTful backend.

## Features

- **User-friendly Interface**: Clean and intuitive design for browsing books
- **Category Navigation**: Browse books by categories (Fantasy, Romance, Thriller, Horror)
- **Book Details**: View detailed information about each book
- **Shopping Cart**: Add, update quantities, and remove items from your cart
- **Checkout Process**: Complete purchase with customer information
- **Order Management**: Process orders with secure transaction handling
- **Order Confirmation**: Receive detailed order confirmation with masked credit card information
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technology Stack

### Frontend
- React with TypeScript for type safety
- Context API for state management
- CSS for styling and responsive design
- Axios for API communication
- React Router for navigation

### Backend
- Java with JAX-RS for RESTful API endpoints
- JDBC for database access and management
- Transaction management for data integrity
- DAO pattern for structured data access
- Input validation and error handling

## Project Structure

### Client
- `src/components`: React components for UI elements
- `src/contexts`: Context providers for state management
- `src/reducers`: State reducers for managing application state
- `src/assets`: Static assets including images and CSS
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions for formatting and validation

### Server
- `src/main/java/api`: API endpoints and request handling
- `src/main/java/business`: Business logic and service implementations
- `src/main/java/business/book`: Book-related functionality
- `src/main/java/business/category`: Category management
- `src/main/java/business/cart`: Shopping cart implementation
- `src/main/java/business/customer`: Customer data management
- `src/main/java/business/order`: Order processing and transaction handling

## Key Implementation Details

- **State Management**: Uses React Context API and reducers for efficient state management
- **Data Validation**: Comprehensive validation for all user inputs
- **Security**: Credit card information is masked, showing only the last four digits
- **Transaction Processing**: Secure transaction-based order processing with rollback capability
- **Error Handling**: Robust error handling with appropriate user feedback

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js and npm
- A relational database (MySQL, PostgreSQL, etc.)

### Running the Backend
1. Navigate to the `server` directory
2. Run `./gradlew build` to build the project
3. Run `./gradlew appRun` to start the server

### Running the Frontend
1. Navigate to the `client` directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open your browser to `http://localhost:3000`

## Database Schema
The application uses a relational database with the following key tables:
- [book](cci:1://file:///Users/siddarthbandi/Desktop/SID/VT/WebDev/CS5244/SiddarthBookstoreReactTransact/server/src/main/java/api/ApiResource.java:47:4-57:5): Book information including title, author, price
- [category](cci:1://file:///Users/siddarthbandi/Desktop/SID/VT/WebDev/CS5244/SiddarthBookstoreReactTransact/server/src/main/java/api/ApiResource.java:35:4-45:5): Book categories
- `customer`: Customer information
- `customer_order`: Order information
- `customer_order_line_item`: Line items for each order

## Future Enhancements
- User authentication and accounts
- Book reviews and ratings
- Advanced search functionality
- Wish list feature
- Admin dashboard for inventory management
