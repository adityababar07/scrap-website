import { useState, useEffect } from "react";
import userPlaceholder from "./assets/user.svg";
import api from "./api"; // Import api

export default function Profile() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: userPlaceholder,
    });
    const [customerId, setCustomerId] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Fetch User info (username, email) and Customer info (phone, address)
            // We can get both from customers/ endpoint since we updated the serializer
            const response = await api.get('customers/');

            if (response.data && response.data.length > 0) {
                const profile = response.data[0];
                const userData = {
                    name: profile.username, // User's username
                    email: profile.email,
                    phone: profile.phone_field || "",
                    address: "", // Address is in CheckoutAddress, but maybe we want to store it in Customer too? 
                    // Model has phone_field. Address is separate model CheckoutAddress.
                    // Profile.jsx expects address. We can fetch CheckoutAddress too or just leave it blank/managed separately.
                    // For now, let's map what we have.
                    avatar: userPlaceholder, // Avatar not in backend yet
                };
                setUser(userData);
                setFormData(userData);
                setCustomerId(profile.id);
            } else {
                // get auth/users/me/ directly using absolute path since it's mounted at root not /api/
                const me = await api.get(`${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}/auth/users/me/`);
                const userData = {
                    name: me.data.username,
                    email: me.data.email,
                    phone: "",
                    address: "",
                    avatar: userPlaceholder,
                };
                setUser(userData);
                setFormData(userData);
                // Create customer profile silently?
                await api.post('customers/', { phone_field: "" });
                // Refetch to get ID
                const newResponse = await api.get('customers/');
                if (newResponse.data.length > 0) setCustomerId(newResponse.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, avatar: imageUrl }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Update User profile (username, email) via Djoser
            await api.patch(`${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}/auth/users/me/`, {
                username: formData.name,
                email: formData.email
            });

            // Update Customer profile (phone)
            if (customerId) {
                await api.patch(`customers/${customerId}/`, {
                    phone_field: formData.phone
                });
            }

            setUser({ ...formData });
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. " + (error.response?.data ? JSON.stringify(error.response.data) : ""));
        }
    };

    const handleCancel = () => {
        setFormData({ ...user });
        setIsEditing(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-10 flex justify-center">
            <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="card-title text-2xl font-bold">My Profile</h2>
                        {!isEditing && (
                            <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSave}>
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="avatar mb-4">
                                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={formData.avatar} alt="Profile" />
                                </div>
                            </div>
                            {isEditing && (
                                <div className="form-control w-full max-w-xs">
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Personal Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Full Name (Username)</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                    disabled={!isEditing} // Username usually fixed
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                    disabled={!isEditing} // Email usually fixed
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Phone Number</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Address removed from form as it's not in Customer model yet, 
                                but we kept the textarea in UI for now as disabled or maybe link to CheckoutAddress later.
                                Let's disable it for now or remove. */}
                        </div>

                        {/* Actions */}
                        {isEditing && (
                            <div className="flex justify-end gap-2 mt-8">
                                <button type="button" className="btn btn-ghost" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
