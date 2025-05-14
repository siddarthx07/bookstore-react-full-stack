import {createContext, Dispatch, useReducer, ReactNode, useEffect, useState} from "react";
import {cartReducer, CartTypes} from "../reducers/CartReducer";
import {BookItem, ShoppingCartItem} from "../types";

const initialCartState: ShoppingCartItem[] = [];
const storageKey = 'cart';
const lastCategoryKey = 'lastVisitedCategory';

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

export const CartStore = createContext<{
    cart: ShoppingCartItem[];
    dispatch: Dispatch<CartAction>;
    lastVisitedCategory: string;
    setLastVisitedCategory: (category: string) => void;
}>({ 
    cart: initialCartState,
    dispatch: () => null,
    lastVisitedCategory: 'fantasy', // Default category
    setLastVisitedCategory: () => null
});

CartStore.displayName = 'CartContext';

type Props = {
    children: ReactNode;
};

export function CartProvider({children}: Props) {
    // Initialize cart from local storage if available
    const [cart, dispatch] = useReducer(cartReducer, initialCartState,
        (initialState) => {
            try {
                const storedCart = JSON.parse(localStorage.getItem(storageKey) || '[]');
                return storedCart as ShoppingCartItem[] || initialState;
            } catch (error) {
                console.log('Error parsing cart', error);
                return initialState;
            }
        }
    );
    
    // Track last visited category
    const [lastVisitedCategory, setLastVisitedCategory] = useState<string>(() => {
        try {
            return localStorage.getItem(lastCategoryKey) || 'fantasy';
        } catch (error) {
            return 'fantasy';
        }
    });

    // Save cart to local storage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart to local storage:', error);
        }
    }, [cart]);
    
    // Save last visited category to local storage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(lastCategoryKey, lastVisitedCategory);
        } catch (error) {
            console.error('Error saving last visited category:', error);
        }
    }, [lastVisitedCategory]);

    // Wrap dispatch to add logging
    const wrappedDispatch = (action: any) => {
        console.log('CartContext: Dispatching action:', action);
        dispatch(action);
    };

    return (
        <CartStore.Provider value={{
            cart, 
            dispatch: wrappedDispatch,
            lastVisitedCategory,
            setLastVisitedCategory
        }}>
            {children}
        </CartStore.Provider>
    );
}
