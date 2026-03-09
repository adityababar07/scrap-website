
import { useState } from "react";
import { useProducts } from "../ProductContext";

export default function AdminProducts() {
    const { products, addProduct, deleteProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        weight: "",
        unit: "kg",
        category: "Metal",
        location: "",
        image: null,
        description: "",
        seller: {
            name: "Admin Seller",
            address: "Admin HQ",
            phone: "1234567890",
            email: "admin@example.com"
        }
    });

    const categories = ["Metal", "Electronics", "Plastic", "Paper", "Glass", "Other"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation could go here
        addProduct({
            ...newProduct,
            price: Number(newProduct.price),
            weight: Number(newProduct.weight)
        });
        setIsModalOpen(false);
        // Reset form
        setNewProduct({
            name: "",
            price: "",
            weight: "",
            unit: "kg",
            category: "Metal",
            location: "",
            image: null,
            description: "",
            seller: {
                name: "Admin Seller",
                address: "Admin HQ",
                phone: "1234567890",
                email: "admin@example.com"
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Products Management</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="card bg-base-100 shadow-xl overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={product.image} alt={product.name} />
                                        </div>
                                    </div>
                                </td>
                                <td className="font-bold">{product.name}</td>
                                <td>
                                    <span className="badge badge-ghost badge-sm">{product.category}</span>
                                </td>
                                <td>₹{product.price}/{product.unit}</td>
                                <td>{product.weight} {product.unit}</td>
                                <td>{product.location}</td>
                                <td>
                                    <button
                                        className="btn btn-ghost btn-xs text-error"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this product?')) {
                                                deleteProduct(product.id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">Add New Product</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="form-control">
                                <label className="label"><span className="label-text">Product Name</span></label>
                                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} className="input input-bordered" required />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Category</span></label>
                                <select name="category" value={newProduct.category} onChange={handleInputChange} className="select select-bordered">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Price (₹)</span></label>
                                <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} className="input input-bordered" required min="0" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Stock Weight</span></label>
                                <div className="join">
                                    <input type="number" name="weight" value={newProduct.weight} onChange={handleInputChange} className="input input-bordered join-item w-full" required min="0" />
                                    <select name="unit" value={newProduct.unit} onChange={handleInputChange} className="select select-bordered join-item">
                                        <option value="kg">kg</option>
                                        <option value="ton">ton</option>
                                        <option value="lbs">lbs</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Location</span></label>
                                <input type="text" name="location" value={newProduct.location} onChange={handleInputChange} className="input input-bordered" required />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Product Image</span></label>
                                <input type="file" name="image" onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.files[0] }))} className="file-input file-input-bordered w-full" />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label"><span className="label-text">Description</span></label>
                                <textarea name="description" value={newProduct.description} onChange={handleInputChange} className="textarea textarea-bordered h-24" required></textarea>
                            </div>

                            <div className="modal-action md:col-span-2">
                                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
