import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

export default function Cart() {
    const { cartItems, removeFromCart, getCartTotal } = useCart();
    const [shipping, setShipping] = useState(20.0);
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const total = subtotal + (cartItems.length > 0 ? shipping : 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-10">
            <h1 className="text-3xl font-bold text-base-content mb-8 text-center">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                {/* Cart Items List */}
                <div className="flex-1">
                    {cartItems.length === 0 ? (
                        <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Your cart is empty. <Link to="/buy" className="link font-bold">Start shopping</Link></span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="card card-side bg-base-100 shadow-xl">
                                    <figure className="w-32 h-32 md:w-48 md:h-auto object-cover">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </figure>
                                    <div className="card-body p-4 md:p-8">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="card-title text-lg md:text-xl">{item.name}</h2>
                                                <p className="text-sm opacity-70">Weight: {item.quantity} kg</p>
                                            </div>
                                            <button
                                                className="btn btn-square btn-sm btn-ghost text-error"
                                                onClick={() => removeFromCart(item.id)}
                                                aria-label="Remove item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <div className="card-actions justify-end items-center mt-auto">
                                            <span className="text-lg font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="card bg-base-100 shadow-xl sticky top-24">
                        <div className="card-body">
                            <h2 className="card-title text-xl mb-4">Order Summary</h2>

                            <div className="flex justify-between mb-2">
                                <span className="opacity-70">Subtotal</span>
                                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between mb-4">
                                <span className="opacity-70">Shipping</span>
                                <span className="font-semibold">₹{(cartItems.length > 0 ? shipping : 0).toFixed(2)}</span>
                            </div>

                            <div className="divider my-0"></div>

                            <div className="flex justify-between mt-4 mb-8">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-bold text-primary">₹{total.toFixed(2)}</span>
                            </div>

                            <button
                                className="btn btn-primary btn-block"
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </button>

                            <div className="mt-4 text-center">
                                <Link to="/buy" className="link link-hover text-sm">Continue Shopping</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
