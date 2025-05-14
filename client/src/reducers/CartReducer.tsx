import { ShoppingCartItem, BookItem } from "../types";
import { Dispatch, ReducerAction } from "react";

export const CartTypes = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
    CLEAR: 'CLEAR'
};

type CartAction = {
    type: typeof CartTypes.ADD;
    id: number;
    item: BookItem;
} | {
    type: typeof CartTypes.REMOVE;
    id: number;
    item: BookItem;
} | {
    type: typeof CartTypes.CLEAR;
    id: number;
    item: BookItem;
};

export const cartReducer = (state: ShoppingCartItem[], action: CartAction): ShoppingCartItem[] => {
    console.log('CartReducer: Current state:', state);
    console.log('CartReducer: Action:', action);

    switch (action.type) {
        case CartTypes.ADD:
            const existingItemIndex = state.findIndex((item) => item.id === action.item.bookId);
            console.log('CartReducer: Existing item index:', existingItemIndex);

            if (existingItemIndex !== -1) {
                // If item exists, increase quantity
                const updatedState = [...state];
                updatedState[existingItemIndex].quantity += 1;
                console.log('CartReducer: Updated state (existing item):', updatedState);
                return updatedState;
            } else {
                // Add new item to cart using the ShoppingCartItem constructor
                const newState = [
                    ...state,
                    new ShoppingCartItem(action.item)
                ];
                console.log('CartReducer: Updated state (new item):', newState);
                return newState;
            }
        case CartTypes.REMOVE:
            const itemToRemoveIndex = state.findIndex((item) => item.id === action.item.bookId);
            console.log('CartReducer: Item to remove index:', itemToRemoveIndex);
            
            if (itemToRemoveIndex === -1) {
                // Item not found in cart, return state unchanged
                return state;
            }
            
            const updatedRemoveState = [...state];
            const currentItem = updatedRemoveState[itemToRemoveIndex];
            
            if (currentItem.quantity > 1) {
                // If quantity > 1, decrement the quantity
                updatedRemoveState[itemToRemoveIndex].quantity -= 1;
                console.log('CartReducer: Updated state (decreased quantity):', updatedRemoveState);
                return updatedRemoveState;
            } else {
                // If quantity is 1, remove the item from cart
                const filteredState = state.filter((item) => item.id !== action.item.bookId);
                console.log('CartReducer: Updated state (removed item):', filteredState);
                return filteredState;
            }
            
        case CartTypes.CLEAR:
            // Clear the entire cart by returning an empty array
            console.log('CartReducer: Clearing cart');
            return [];
        default:
            throw new Error(`Invalid action type ${action.type}`);
    }
};