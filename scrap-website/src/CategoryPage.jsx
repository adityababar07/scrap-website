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
                                        src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
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

                                <p className="text-xs text-base-content/70">
                                    Condition: {product.condition || 'Used'} <br/>
                                    Listed: {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Recently'}
                                </p>

                                <div className="card-actions justify-between items-center mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-primary">₹{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-base-content/50 line-through">₹{product.originalPrice}</span>
                                        )}
                                    </div>
                                    <button 
                                        className="btn btn-circle btn-sm btn-neutral hover:btn-primary"
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
            )}
        </div>
    );
}

export default CategoryPage;
