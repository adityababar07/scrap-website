import { createContext, useState, useContext, useEffect } from 'react';
import api from './api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize with some mock data for demonstration
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCartItems([]);
            return;
        }
        try {
            const response = await api.get('orders/cart/');
            // The endpoint returns the order object, which has 'items' array.
            // Items invoke OrderItemSerializer, which has 'product' (ProductSerializer).
            // We need to map this to the structure our components expect if different, 
            // or update components to match this structure.
            // Let's assume we map it to be safe and consistent with previous mock data structure where possible.
            if (response.data && response.data.items) {
                const mappedItems = response.data.items.map(item => ({
                    id: item.id, // OrderItem ID
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image 
                        ? (item.product.image.startsWith('http') ? item.product.image : `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}${item.product.image}`) 
                        : null,
                    stock: item.product.quantity // Available stock
                }));
                setCartItems(mappedItems);
            } else {
                setCartItems([]);
            }

        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to add items to cart.");
            return;
        }
        try {
            await api.post('orders/add-to-cart/', {
                product_id: product.id,
                quantity: parseFloat(product.quantity || 1.0)
            });
            alert("Added to cart!");
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error("Failed to add to cart:", error);
            const errorMsg = error.response?.data?.error || "Failed to add to cart.";
            alert(errorMsg);
        }
    };

    const removeFromCart = async (id) => {
        try {
            await api.delete(`order-items/${id}/`);
            fetchCart();
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const updateQuantity = async (id, quantity) => {
        // We'd need an endpoint to update OrderItem quantity directly.
        // For now, simpler to just re-add or maybe implement update logic.
        // Let's skip complex update for this iteration and focus on add/remove.
        console.log("Update quantity not fully implemented via API yet");
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
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
                fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
