import { useState, useEffect } from "react";
import userPlaceholder from "./assets/user.svg";

export default function Profile() {
    const [user, setUser] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        address: "123 Scrap St, Recycle City",
        avatar: userPlaceholder,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    useEffect(() => {
        // Simulate fetching user data
        // In a real app, you'd fetch from an API here
        setFormData({ ...user });
    }, []);

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

    const handleSave = (e) => {
        e.preventDefault();
        setUser({ ...formData });
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    const handleCancel = () => {
        setFormData({ ...user });
        setIsEditing(false);
    };

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
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                    disabled={!isEditing}
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
                                    disabled={!isEditing} // Email usually isn't editable easily
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

                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text">Address</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered h-24"
                                    disabled={!isEditing}
                                ></textarea>
                            </div>
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
