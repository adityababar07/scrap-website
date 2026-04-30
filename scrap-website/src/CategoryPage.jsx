import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import api from "./api"; // Import api

function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();
    
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("Category");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch category details to get the name
                const categoryRes = await api.get(`categories/${categoryId}/`);
                setCategoryName(categoryRes.data.category_name);

                // Fetch products specifically for this category
                const productsRes = await api.get(`products/?category=${categoryId}`);
                setProducts(productsRes.data);
            } catch (err) {
                console.error("Failed to load category data", err);
                setError("Failed to load category or its products.");
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchData();
        }
    }, [categoryId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex justify-center items-center">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-200 p-4 md:p-10 text-center">
                <h1 className="text-2xl font-bold text-error mb-4">Error</h1>
                <p>{error}</p>
                <Link to="/buy" className="btn btn-primary mt-6">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/buy" className="btn btn-circle btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-base-content">{categoryName} Products</h1>
                </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center p-12 bg-base-100 rounded-box shadow-sm">
                    <h2 className="text-xl font-semibold opacity-60">No items available in this category right now.</h2>
                    <p className="mt-2 opacity-50">Check back later or browse other categories!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="card bg-base-100 shadow-xl group">
                            {/* Sale Badge */}
                            {product.isOnSale && (
                                <div className="absolute top-2 right-2 badge badge-secondary z-10">SALE</div>
                            )}

                            <figure className="px-4 pt-4 h-48 relative overflow-hidden">
                                {product.image ? (
                                    <img 
                                        src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}${product.image}`} 
                                        alt={product.name} 
                                        className="rounded-xl object-cover h-full w-full group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="rounded-xl bg-base-200 h-full w-full flex flex-col justify-center items-center group-hover:bg-base-300 transition-colors duration-300 text-base-content/30 italic">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        No Image Provided
                                    </div>
                                )}
                            </figure>

                            <div className="card-body">
                                <h2 className="card-title text-sm h-10 overflow-hidden line-clamp-2" title={product.name}>
                                    {product.name}
                                </h2>

                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex justify-between items-center text-xs opacity-70">
                                        <span>Condition: {product.condition || 'Used'}</span>
                                        <span>Available: {product.quantity} kg</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-primary">₹{product.price}</span>
                                            <span className="text-[10px] opacity-50 uppercase font-bold">per kg</span>
                                        </div>
                                        
                                        <div className="flex items-center bg-base-200 rounded-lg px-2 py-1 ml-auto">
                                            <input 
                                                type="number" 
                                                defaultValue="1.0" 
                                                min="0.1" 
                                                max={product.quantity} 
                                                step="0.1"
                                                className="bg-transparent border-none outline-none text-sm w-12 font-bold text-center"
                                                id={`cat-qty-${product.id}`}
                                            />
                                            <span className="text-xs opacity-60 font-bold">kg</span>
                                        </div>
                                        
                                        <button 
                                            className="btn btn-primary btn-sm btn-circle"
                                            onClick={() => {
                                                const qty = parseFloat(document.getElementById(`cat-qty-${product.id}`).value);
                                                addToCart({ ...product, quantity: qty });
                                            }}
                                            aria-label="Add to cart"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryPage;
