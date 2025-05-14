import React, { createContext, useReducer, ReactNode } from 'react';
import { OrderDetails } from '../types';
import { orderDetailsReducer, initialOrderDetailsState, OrderDetailsTypes } from '../reducers/OrderDetailsReducer';

// Define the context type
type OrderDetailsContextType = {
  orderDetails: OrderDetails | null;
  updateOrderDetails: (orderDetails: OrderDetails) => void;
  clearOrderDetails: () => void;
};

// Create the context with a default value
export const OrderDetailsContext = createContext<OrderDetailsContextType>({
  orderDetails: null,
  updateOrderDetails: () => {},
  clearOrderDetails: () => {}
});

// Props for the provider component
type OrderDetailsProviderProps = {
  children: ReactNode;
};

// Create the provider component
export const OrderDetailsProvider: React.FC<OrderDetailsProviderProps> = ({ children }) => {
  const [orderDetails, dispatch] = useReducer(orderDetailsReducer, initialOrderDetailsState);

  // Function to update order details
  const updateOrderDetails = (newOrderDetails: OrderDetails) => {
    dispatch({
      type: OrderDetailsTypes.UPDATE,
      payload: newOrderDetails
    });
  };

  // Function to clear order details
  const clearOrderDetails = () => {
    dispatch({
      type: OrderDetailsTypes.CLEAR
    });
  };

  return (
    <OrderDetailsContext.Provider value={{ orderDetails, updateOrderDetails, clearOrderDetails }}>
      {children}
    </OrderDetailsContext.Provider>
  );
};
