import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import api from "./api";

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, fetchCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [addressData, setAddressData] = useState({
        address: "",
        city: "",
        zip_code: ""
    });
    
    // Check if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/buy");
        }
    }, [cartItems, navigate]);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e) => {
        setAddressData({ ...addressData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if (!addressData.address || !addressData.city || !addressData.zip_code) {
            alert("Please fill in all address fields.");
            return;
        }

        setLoading(true);

        try {
            // 1. Save Address
            // we check if an address exists, but for simplicity, we just POST. The backend might create multiple.
            // A better way is to POST it.
            await api.post("addresses/", addressData);

            // 2. Initiate Payment
            const res = await api.post("orders/initiate_payment/");
            const { order_id, amount, currency, key, merchant_name, description, prefill } = res.data;

            // 3. Configure Razorpay
            const options = {
                key: key,
                amount: amount,
                currency: currency,
                name: merchant_name,
                description: description,
                order_id: order_id,
                prefill: prefill,
                theme: {
                    color: "#4f46e5" // Primary daisyUI color matching ScrapX theme approximately
                },
                handler: async function (response) {
                    try {
                        // 4. Verify Payment on success
                        const verifyRes = await api.post("orders/verify_payment/", {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        
                        if (verifyRes.status === 200) {
                            alert("Payment Successful! Your scrap pickup is scheduled.");
                            fetchCart(); // This will clear the cart as it fetches the newly zeroed order
                            navigate("/profile"); 
                        }
                    } catch (error) {
                        console.error("Payment verification failed", error);
                        alert("Payment verification failed. Please contact support.");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            
            rzp.on('payment.failed', function (response){
                console.error(response.error);
                alert(`Payment Failed: ${response.error.description}`);
            });

            rzp.open();

        } catch (error) {
            console.error("Checkout failed", error);
            alert(error.response?.data?.error || "Checkout completely failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const subtotal = getCartTotal();
    const shipping = 20.0;
    const total = subtotal + shipping;

    if (cartItems.length === 0) return null;

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-10 flex justify-center">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Checkout Form */}
                <div className="card bg-base-100 shadow-xl h-fit">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6">Delivery Address</h2>
                        <form onSubmit={handlePayment} className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Street Address</span>
                                </label>
                                <textarea 
                                    name="address"
                                    value={addressData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main St, Apt 4B" 
                                    className="textarea textarea-bordered h-24" 
                                    required 
                                ></textarea>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">City</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="city"
                                        value={addressData.city}
                                        onChange={handleChange}
                                        placeholder="Mumbai" 
                                        className="input input-bordered w-full" 
                                        required 
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Zip Code</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="zip_code"
                                        value={addressData.zip_code}
                                        onChange={handleChange}
                                        placeholder="400001" 
                                        className="input input-bordered w-full" 
                                        required 
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-full mt-6"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : "Pay With Razorpay"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="card bg-base-100 shadow-xl h-fit sticky top-24">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">Order Summary</h2>
                        
                        <div className="flex flex-col gap-3 mb-6 max-h-64 overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-base-200 p-2 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm line-clamp-1">{item.name}</span>
                                        <span className="text-xs opacity-70">{item.quantity} kg</span>
                                    </div>
                                    <span className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex justify-between text-sm mb-2">
                            <span className="opacity-70">Subtotal</span>
                            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-4">
                            <span className="opacity-70">Pickup/Shipping Fee</span>
                            <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-base-200 p-3 rounded-xl mt-2">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-xl text-primary">₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
