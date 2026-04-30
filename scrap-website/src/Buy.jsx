import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useProducts } from "./ProductContext";
import api from "./api"; // Import api

function Buy() {
    const { addToCart } = useCart();
    const { products, loading } = useProducts(); 
    const [categories, setCategories] = useState([]);
    const [personalRecs, setPersonalRecs] = useState([]);
    const [recsLoading, setRecsLoading] = useState(false);
    const [hasHistory, setHasHistory] = useState(false);
    const [recQtys, setRecQtys] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const carouselRef = useRef(null);
    const recsCarouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: direction * 280, behavior: "smooth" });
        }
    };

    const scrollRecsCarousel = (direction) => {
        if (recsCarouselRef.current) {
            recsCarouselRef.current.scrollBy({ left: direction * 280, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('categories/');
                // Map images if needed, or use robust inline SVGs if missing
                const mappedCategories = response.data.map(cat => {
                    const safeName = cat.category_name.replace(/"/g, '&quot;');
                    const searchKeywords = cat.category_name.toLowerCase().replace(/[^a-z0-9]+/g, ',');
                    
                    const categoryImages = {
                        'Metal': '/media/images/cast-iron.jpg',
                        'Wood': '/media/images/wood-chips.jpg',
                        'Glass': '/media/images/waste-glass.jpg',
                        'Plastic': '/media/images/plastic-bottles.jpg',
                        'Paper': '/media/images/waste-newspaper.jpg',
                        'Fabric': '/media/images/fabric-scrap.jpg',
                        'E-Scrap': '/media/images/circuit-boards.jpg',
                        'Electronics': '/media/images/circuit-boards.jpg',
                        'Metals': '/media/images/cast-iron.jpg'
                    };
                    
                    const localImage = categoryImages[cat.category_name];
                    const defaultImageUrl = localImage 
                        ? `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}${localImage}` 
                        : `https://loremflickr.com/300/300/${searchKeywords},scrap,texture/all`;
                    
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="#374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="30" fill="#9ca3af" font-weight="bold">${safeName}</text></svg>`;
                    const fallbackUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

                    return {
                        ...cat,
                         image: cat.image 
                            ? (cat.image.startsWith('http') ? cat.image : `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}${cat.image}`)
                            : defaultImageUrl,
                         fallback: fallbackUrl
                    };
                });
                setCategories(mappedCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch personalized recommendations for logged-in users
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setIsLoggedIn(false); return; }
        setIsLoggedIn(true);
        setRecsLoading(true);
        api.get('personalized-recommendations/')
            .then(res => {
                setPersonalRecs(res.data.recommendations || []);
                setHasHistory(res.data.has_history);
            })
            .catch(() => setPersonalRecs([]))
            .finally(() => setRecsLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-6 md:p-10">
            {/* Trending Now Section */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-base-content">Trending Now</h2>
                    <div className="flex gap-2">
                        <button className="btn btn-circle btn-sm btn-ghost" onClick={() => scrollCarousel(-1)}>❮</button>
                        <button className="btn btn-circle btn-sm btn-ghost" onClick={() => scrollCarousel(1)}>❯</button>
                    </div>
                </div>

                <div ref={carouselRef} className="carousel carousel-center w-full p-4 space-x-4 bg-transparent rounded-box" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
                    {products.map((product) => (
                        <div key={product.id} className="carousel-item">
                            <div className="card w-64 bg-base-100 shadow-xl relative group">
                                {/* Sale Badge */}
                                {product.originalPrice && (
                                    <div className="absolute top-2 left-2 badge badge-secondary z-10">Sale</div>
                                )}
                                <figure className="h-64 overflow-hidden">
                                    <Link to={`/product/${product.id}`}>
                                        <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                                    </Link>
                                </figure>
                                <div className="absolute bottom-4 left-4 right-4 bg-base-100/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-base-content/5">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm text-base-content line-clamp-1 flex-1 mr-2">
                                                <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <span className="text-primary font-bold text-sm whitespace-nowrap">₹{product.price}/kg</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center bg-base-200 rounded-lg px-2 py-0.5">
                                                <input 
                                                    type="number" 
                                                    defaultValue="1.0" 
                                                    min="0.1" 
                                                    max={product.weight} 
                                                    step="0.1"
                                                    className="bg-transparent border-none outline-none text-xs w-12 font-semibold text-center"
                                                    id={`qty-${product.id}`}
                                                />
                                                <span className="text-[10px] opacity-60 font-bold uppercase">kg</span>
                                            </div>
                                            
                                            <button 
                                                className="btn btn-primary btn-xs flex-1 text-[10px] gap-1 px-1 h-7 min-h-7"
                                                onClick={() => {
                                                    const qty = parseFloat(document.getElementById(`qty-${product.id}`).value);
                                                    addToCart({ ...product, quantity: qty });
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                                ADD
                                            </button>
                                        </div>
                                        {product.weight > 0 && (
                                            <div className="text-[9px] opacity-40 text-center font-medium">
                                                Available: {product.weight} kg
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── You Might Like ─── */}
            {isLoggedIn ? (
                (recsLoading || personalRecs.length > 0) && (
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-7 rounded-full bg-secondary"></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-base-content">You Might Like</h2>
                                    {hasHistory && (
                                        <p className="text-xs text-base-content/50 mt-0.5">Based on your cart & purchase history</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-circle btn-sm btn-ghost" onClick={() => scrollRecsCarousel(-1)}>❮</button>
                                <button className="btn btn-circle btn-sm btn-ghost" onClick={() => scrollRecsCarousel(1)}>❯</button>
                            </div>
                        </div>

                        <div ref={recsCarouselRef} className="carousel carousel-center w-full p-4 space-x-4 bg-transparent rounded-box" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
                            {recsLoading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="carousel-item">
                                        <div className="card w-56 bg-base-100 shadow-xl animate-pulse">
                                            <div className="h-40 bg-base-300 rounded-t-2xl"></div>
                                            <div className="card-body p-3 gap-2">
                                                <div className="h-3 bg-base-300 rounded w-3/4"></div>
                                                <div className="h-3 bg-base-300 rounded w-1/2"></div>
                                                <div className="h-7 bg-base-300 rounded mt-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : personalRecs.map(rec => (
                                    <div key={rec.id} className="carousel-item">
                                        <div className="card w-56 bg-base-100 shadow-xl group overflow-hidden relative">
                                            {rec.category && (
                                                <div className="absolute top-2 left-2 z-10 badge badge-secondary badge-sm font-semibold text-white">
                                                    {rec.category.category_name}
                                                </div>
                                            )}
                                            <Link to={`/product/${rec.id}`}>
                                                <figure className="h-40 overflow-hidden">
                                                    <img
                                                        src={rec.image ? (rec.image.startsWith('http') ? rec.image : `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}${rec.image}`) : ''}
                                                        alt={rec.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                </figure>
                                            </Link>
                                            <div className="absolute bottom-4 left-4 right-4 bg-base-100/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-base-content/5">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-sm text-base-content line-clamp-1 flex-1 mr-2">
                                                            <Link to={`/product/${rec.id}`} className="hover:text-secondary transition-colors">
                                                                {rec.name}
                                                            </Link>
                                                        </h3>
                                                        <span className="text-secondary font-bold text-sm whitespace-nowrap">₹{rec.price}/kg</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
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
                                                            className="btn btn-secondary btn-xs flex-1 text-[10px] gap-1 px-1 h-7 min-h-7"
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
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )
            ) : (
                <section className="mb-12">
                    <div className="card bg-base-100 shadow-sm border border-dashed border-base-content/20 p-6 flex flex-col sm:flex-row items-center gap-4 rounded-2xl">
                        <div className="text-4xl">✨</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-base-content">Personalised picks, just for you</h3>
                            <p className="text-sm text-base-content/60 mt-1">Log in to see recommendations based on your cart &amp; purchase history.</p>
                        </div>
                        <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
                    </div>
                </section>
            )}

            {/* Shop By Categories Section */}
            <section>
                <h2 className="text-2xl font-bold text-base-content mb-6">Shop By Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link to={`/category/${category.id}`} key={category.id} className="card bg-base-100 shadow-xl h-64 cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden relative block">
                            <figure className="w-full h-full">
                                <img 
                                    src={category.image} 
                                    alt={category.category_name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = category.fallback; }}
                                />
                            </figure>
                            <div className="card-body absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                <h2 className="card-title text-white font-bold">{category.category_name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Buy;