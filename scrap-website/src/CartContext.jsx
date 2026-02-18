import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize with some mock data for demonstration
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Copper Wire Scrap",
            price: 15.5,
            quantity: 10,
            image: "https://images.unsplash.com/photo-1549419137-975924d5507b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
            id: 2,
            name: "Aluminum Cans",
            price: 2.2,
            quantity: 50,
            image: "https://images.unsplash.com/photo-1596483569476-c5e3f4337d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
            id: 3,
            name: "Old Electronics",
            price: 45.0,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
    ]);

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id);
            if (existingItem) {
                return prevItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prevItems, item];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        // Returns number of unique items, or total quantity if preferred. 
        // Usually navbar badges show unique items count or total quantity. 
        // Let's go with unique items for now, or total quantity? 
        // Features.md doesn't specify, but typical e-commerce is unique items. 
        // Wait, typically it's total *items* in cart (sum of quantities) or unique products.
        // Let's use unique products count for the badge as it's cleaner.
        return cartItems.length;
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
