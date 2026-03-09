import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useProducts } from "./ProductContext";
import api from "./api"; // Import api

function Buy() {
    const { addToCart } = useCart();
    const { products, loading } = useProducts(); 
    const [categories, setCategories] = useState([]);

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
                        ? `http://127.0.0.1:8000${localImage}` 
                        : `https://loremflickr.com/300/300/${searchKeywords},scrap,texture/all`;
                    
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="#374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="30" fill="#9ca3af" font-weight="bold">${safeName}</text></svg>`;
                    const fallbackUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

                    return {
                        ...cat,
                         image: cat.image 
                            ? (cat.image.startsWith('http') ? cat.image : `http://127.0.0.1:8000${cat.image}`)
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
                        <button className="btn btn-circle btn-sm btn-ghost">❮</button>
                        <button className="btn btn-circle btn-sm btn-ghost">❯</button>
                    </div>
                </div>

                <div className="carousel carousel-center w-full p-4 space-x-4 bg-transparent rounded-box">
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
                                {/* Floating Info Bar */}
                                <div className="absolute bottom-4 left-4 right-4 bg-base-100/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-sm text-base-content">
                                            <Link to={`/product/${product.id}`} className="hover:underline">
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className="text-xs">
                                            <span className="font-bold text-base-content">${product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-base-content/50 line-through ml-2">${product.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-circle btn-xs btn-neutral hover:btn-primary"
                                        onClick={() => addToCart({ ...product, quantity: 1 })}
                                        aria-label="Add to cart"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

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