import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useProducts } from "./ProductContext";
import api from "./api";
import user from "./assets/user.svg";

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { products, loading } = useProducts();
    const [quantity, setQuantity] = useState(1.0);
    const [recommendations, setRecommendations] = useState([]);
    const [recsLoading, setRecsLoading] = useState(false);
    const [recQtys, setRecQtys] = useState({});

    // Fetch recommendations whenever the viewed product changes
    useEffect(() => {
        if (!id) return;
        setRecsLoading(true);
        api.get(`recommendations/?product_id=${id}`)
            .then(res => setRecommendations(res.data))
            .catch(() => setRecommendations([]))
            .finally(() => setRecsLoading(false));
    }, [id]);

    // Convert id to number for comparison
    const product = products.find(p => p.id === parseInt(id));

    useEffect(() => {
        if (product && product.weight !== undefined) {
            setQuantity(Math.min(1.0, product.weight));
        }
    }, [product]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Link to="/buy" className="btn btn-primary">Back to Shop</Link>
            </div>
        );
    }

    const isProductAvailable = product.available !== false && product.weight > 0;
    const availableStock = product.weight;
    const isOutOfStock = parseFloat(quantity) > availableStock;
    const totalPrice = (product.price * parseFloat(quantity)).toFixed(2);

    // Max slider value - scale strictly according to actual available stock
    const maxSliderValue = availableStock;

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-10 flex flex-col items-center">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Product Image */}
                <div className="card bg-base-100 shadow-xl overflow-hidden h-fit">
                    <figure className="h-96 w-full">
                        <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                    </figure>
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-6">
                    {/* Main Info Card */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {/* Category */}
                            <div className="flex items-center gap-2 text-base-content/70">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                <span className="font-medium">{product.category || 'General'}</span>
                            </div>

                            {/* Weight */}
                            <div className="flex items-center gap-2 text-base-content/70 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                <span className="font-medium">Total Stock: {isProductAvailable ? product.weight : 0} {product.unit}</span>
                            </div>

                            {/* Quantity Selector */}
                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text font-medium">Select Quantity ({product.unit})</span>
                                    <span className="label-text-alt">Available: {isProductAvailable ? availableStock : 0} {product.unit}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max={maxSliderValue}
                                    step="0.1"
                                    value={isProductAvailable ? quantity : 0}
                                    disabled={!isProductAvailable}
                                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                    className={`range ${!isProductAvailable || isOutOfStock ? 'range-error' : 'range-primary'}`}
                                />
                                <div className="w-full flex justify-between text-xs px-2 mt-2">
                                    <span>0.1 {product.unit}</span>
                                    <span>{maxSliderValue} {product.unit}</span>
                                </div>
                                <div className="text-center font-bold text-lg mt-2">
                                    Selected: {isProductAvailable ? quantity : 0} {product.unit}
                                </div>
                                {!isProductAvailable ? (
                                    <div role="alert" className="alert alert-error mt-2 py-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>Out of Stock! This product is no longer available.</span>
                                    </div>
                                ) : isOutOfStock ? (
                                    <div role="alert" className="alert alert-error mt-2 py-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>Out of stock! Only {availableStock} {product.unit} available.</span>
                                    </div>
                                ) : null}
                            </div>

                            <h2 className="card-title text-3xl font-bold mt-2">{product.name}</h2>
                            <p className="mt-2 text-base-content/80">{product.description}</p>

                            {/* Location */}
                            <div className="flex items-center gap-2 mt-4 text-base-content/70">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>{product.location}</span>
                            </div>

                            {/* Price Breakdown */}
                            <div className="flex flex-col gap-1 mt-6">
                                <span className="text-xl font-bold">Total Price: ₹{isProductAvailable ? totalPrice : "0.00"}</span>
                                <span className="text-sm opacity-70">Rate: ₹{product.price}/{product.unit}</span>
                            </div>

                            <div className="divider"></div>

                            {/* Back & Add to Cart */}
                            <div className="flex gap-4">
                                <Link to="/buy" className="btn btn-ghost flex-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Go Home
                                </Link>
                                <button
                                    className="btn btn-primary flex-1 text-white"
                                    onClick={() => addToCart({ ...product, quantity: quantity })}
                                    disabled={!isProductAvailable || isOutOfStock}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    {isProductAvailable ? "Add to Cart" : "Out of Stock"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Seller Information Card */}
                    {product.seller && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-lg mb-2">Seller Information</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                                            <span className="text-xl">{product.seller.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{product.seller.name}</h4>
                                        <p className="text-sm opacity-70">{product.seller.address}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <a href={`tel:${product.seller.phone}`} className="btn btn-outline btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        Call Seller
                                    </a>
                                    <a href={`mailto:${product.seller.email}`} className="btn btn-outline btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* You Might Also Like */}
            {(recsLoading || recommendations.length > 0) && (
                <section className="max-w-5xl w-full mt-10 mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-7 rounded-full bg-primary"></div>
                        <h2 className="text-xl font-bold text-base-content">You Might Also Like</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {recsLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="card bg-base-100 shadow-xl animate-pulse">
                                    <div className="h-44 bg-base-300 rounded-t-2xl"></div>
                                    <div className="card-body p-3 gap-2">
                                        <div className="h-3 bg-base-300 rounded w-3/4"></div>
                                        <div className="h-3 bg-base-300 rounded w-1/2"></div>
                                        <div className="h-7 bg-base-300 rounded mt-1"></div>
                                    </div>
                                </div>
                            ))
                            : recommendations.map(rec => (
                                <div key={rec.id} className="card bg-base-100 shadow-xl group overflow-hidden relative">
                                    {/* Score badge — category tag */}
                                    {rec.category && (
                                        <div className="absolute top-2 left-2 z-10 badge badge-primary badge-sm font-semibold">
                                            {rec.category.category_name}
                                        </div>
                                    )}
                                    <Link to={`/product/${rec.id}`}>
                                        <figure className="h-44 overflow-hidden">
                                            <img
                                                src={rec.image ? (rec.image.startsWith('http') ? rec.image : `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}${rec.image}`) : ''}
                                                alt={rec.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </figure>
                                    </Link>
                                    <div className="card-body p-3 gap-1">
                                        <Link to={`/product/${rec.id}`} className="font-bold text-sm line-clamp-1 hover:text-primary transition-colors">
                                            {rec.name}
                                        </Link>
                                        <span className="text-primary font-bold text-xs">₹{rec.price}/kg</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="flex items-center bg-base-200 rounded-lg px-2 py-0.5">
                                                <input
                                                    type="number"
                                                    value={recQtys[rec.id] ?? 1.0}
                                                    min="0.1"
                                                    max={rec.quantity}
                                                    step="0.1"
                                                    onChange={e => setRecQtys(prev => ({ ...prev, [rec.id]: parseFloat(e.target.value) }))}
                                                    className="bg-transparent border-none outline-none text-xs w-12 font-semibold text-center"
                                                />
                                                <span className="text-[10px] opacity-60 font-bold uppercase">kg</span>
                                            </div>
                                            <button
                                                className="btn btn-primary btn-xs flex-1 text-[10px] gap-1 px-1 h-7 min-h-7"
                                                onClick={() => addToCart({ ...rec, weight: rec.quantity, quantity: recQtys[rec.id] ?? 1.0 })}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                                ADD
                                            </button>
                                        </div>
                                        {rec.quantity > 0 && (
                                            <div className="text-[9px] opacity-40 text-center font-medium">Available: {rec.quantity} kg</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </section>
            )}
        </div>
    );
}
