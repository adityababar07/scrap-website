import { useState } from "react";

const products = [
    { id: 1, name: "Mixed Aluminium", price: 45, originalPrice: 55, image: "https://placehold.co/300x400/png?text=Aluminium" },
    { id: 2, name: "Copper Wire", price: 75, originalPrice: null, image: "https://placehold.co/300x400/png?text=Copper" },
    { id: 3, name: "Steel Pipes", price: 20, originalPrice: 25, image: "https://placehold.co/300x400/png?text=Steel" },
    { id: 4, name: "E-Waste (PCBs)", price: 90, originalPrice: 120, image: "https://placehold.co/300x400/png?text=E-Waste" },
    { id: 5, name: "Brass Fittings", price: 60, originalPrice: null, image: "https://placehold.co/300x400/png?text=Brass" },
];

const categories = [
    { id: 1, name: "Metals", image: "https://placehold.co/300x300/png?text=Metals" },
    { id: 2, name: "Electronics", image: "https://placehold.co/300x300/png?text=Electronics" },
    { id: 3, name: "Plastic", image: "https://placehold.co/300x300/png?text=Plastic" },
    { id: 4, name: "Paper", image: "https://placehold.co/300x300/png?text=Paper" },
];

function Buy() {
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
                                    <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                                </figure>
                                {/* Floating Info Bar */}
                                <div className="absolute bottom-4 left-4 right-4 bg-base-100/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-sm text-base-content">{product.name}</h3>
                                        <div className="text-xs">
                                            <span className="font-bold text-base-content">${product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-base-content/50 line-through ml-2">${product.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="btn btn-circle btn-xs btn-neutral">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
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
                        <div key={category.id} className="card bg-base-100 shadow-xl image-full h-64 cursor-pointer hover:scale-105 transition-transform duration-300">
                            <figure><img src={category.image} alt={category.name} /></figure>
                            <div className="card-body justify-end">
                                <h2 className="card-title text-white">{category.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Buy;