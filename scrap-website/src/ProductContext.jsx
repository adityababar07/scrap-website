import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
// import { products as initialProducts } from './data';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('products/');
            // Helper to map API response to internal state structure
            const mapProduct = (p) => ({
                id: p.id,
                name: p.name,
                price: parseFloat(p.price),
                originalPrice: null, // Backend doesn't have this yet
                weight: p.quantity, // Mapping quantity to weight
                unit: 'kg', // Defaulting
                category: p.category ? p.category.category_name : 'General',
                location: p.city || p.address || 'Unknown Location',
                image: p.image 
                    ? (p.image.startsWith('http') ? p.image : `http://127.0.0.1:8000${p.image}`) 
                    : 'https://placehold.co/300x400?text=No+Image',
                description: p.description,
                seller: p.seller
            });

            const mappedProducts = response.data.map(mapProduct);
            setProducts(mappedProducts);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (productData) => {
        try {
            // AdminProducts passes a specific structure, we need to adapt it for the API
            // The API expects: name, category_id, price, quantity, description, city, phone, image

            // We need to fetch categories first to find the ID for the string "category" passed from Admin
            // Or we just fetch categories in AdminProducts and pass ID.
            // For now, let's assume we need to handle FormData construction here or in the component.
            // Let's assume the component calls this with a FormData object or we construct it.

            // Actually, AdminProducts passes a plain object.
            // We need to find the category ID.
            const catResponse = await api.get('categories/');
            const category = catResponse.data.find(c => c.category_name === productData.category);
            const categoryId = category ? category.id : 1; // Default or error

            const data = new FormData();
            data.append('name', productData.name);
            data.append('category_id', categoryId);
            data.append('price', productData.price);
            data.append('quantity', productData.weight); // Mapping weight to quantity
            data.append('description', productData.description);
            data.append('city', productData.location);
            // data.append('image', productData.image); // This is a URL string in AdminProducts default... 
            // If it's a file object, append it. If string, maybe skip?
            // AdminProducts current state has "https://placehold.co..." as default string.
            // Real upload needs a file.
            // We will overlook image upload from Admin for this step or require a file input change in Admin.

            await api.post('products/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            fetchProducts(); // Refresh list
        } catch (error) {
            console.error("Failed to add product:", error);
            alert("Failed to add product");
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            // Logic similar to add, using patch/put
            const data = new FormData();
            if (updatedProduct.name) data.append('name', updatedProduct.name);
            if (updatedProduct.price) data.append('price', updatedProduct.price);
            // ... map other fields

            await api.patch(`products/${id}/`, data);
            fetchProducts();
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`products/${id}/`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Failed to delete product");
        }
    };

    return (
        <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
