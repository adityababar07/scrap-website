import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const dataWeekly = [
    { name: "Mon", profit: 400, sold: 24, pending: 10 },
    { name: "Tue", profit: 300, sold: 18, pending: 12 },
    { name: "Wed", profit: 200, sold: 12, pending: 5 },
    { name: "Thu", profit: 278, sold: 20, pending: 8 },
    { name: "Fri", profit: 189, sold: 15, pending: 15 },
    { name: "Sat", profit: 239, sold: 18, pending: 10 },
    { name: "Sun", profit: 349, sold: 22, pending: 5 },
];

const dataMonthly = [
    { name: "Week 1", profit: 1200, sold: 80, pending: 20 },
    { name: "Week 2", profit: 1500, sold: 95, pending: 15 },
    { name: "Week 3", profit: 1100, sold: 70, pending: 25 },
    { name: "Week 4", profit: 1700, sold: 110, pending: 10 },
];

const dataYearly = [
    { name: "Jan", profit: 4000, sold: 240, pending: 50 },
    { name: "Feb", profit: 3000, sold: 200, pending: 40 },
    { name: "Mar", profit: 2000, sold: 150, pending: 30 },
    { name: "Apr", profit: 2780, sold: 180, pending: 40 },
    { name: "May", profit: 1890, sold: 120, pending: 50 },
    { name: "Jun", profit: 2390, sold: 160, pending: 35 },
    { name: "Jul", profit: 3490, sold: 220, pending: 25 },
    { name: "Aug", profit: 4000, sold: 250, pending: 20 },
    { name: "Sep", profit: 3000, sold: 190, pending: 30 },
    { name: "Oct", profit: 2000, sold: 140, pending: 40 },
    { name: "Nov", profit: 2780, sold: 170, pending: 35 },
    { name: "Dec", profit: 1890, sold: 110, pending: 45 },
];

export default function Sell() {
    const [graphView, setGraphView] = useState("weekly");
    const [formData, setFormData] = useState({
        image: null,
        category: "",
        price: "",
        quantity: "",
        description: "",
        location: "",
        contactNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const getGraphData = () => {
        switch (graphView) {
            case "monthly": return dataMonthly;
            case "yearly": return dataYearly;
            default: return dataWeekly;
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);
        alert("Item listed successfully! (Simulated)");
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <h1 className="text-4xl font-bold text-base-content text-center mb-8">Seller Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                    { title: "Profit Earned", value: "$4,200", color: "bg-success text-success-content" },
                    { title: "Items Sold", value: "145", color: "bg-info text-info-content" },
                    { title: "Items Pending", value: "12", color: "bg-warning text-warning-content" },
                    { title: "Items Rejected", value: "5", color: "bg-error text-error-content" },
                    { title: "Items Delivered", value: "128", color: "bg-primary text-primary-content" },
                ].map((stat, index) => (
                    <div key={index} className={`card ${stat.color} shadow-xl`}>
                        <div className="card-body p-4 text-center">
                            <h2 className="card-title justify-center text-sm uppercase opacity-90">{stat.title}</h2>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Graph Section */}
            <div className="card bg-base-100 shadow-xl mb-12">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Performance Overview</h2>
                        <div className="join">
                            {["weekly", "monthly", "yearly"].map((view) => (
                                <button
                                    key={view}
                                    className={`join-item btn btn-sm ${graphView === view ? "btn-active btn-primary" : ""}`}
                                    onClick={() => setGraphView(view)}
                                >
                                    {view.charAt(0).toUpperCase() + view.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getGraphData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }} />
                                <Legend />
                                <Bar dataKey="profit" fill="#8884d8" name="Profit" />
                                <Bar dataKey="sold" fill="#82ca9d" name="Items Sold" />
                                <Bar dataKey="pending" fill="#ffc658" name="Pending" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* List Item Form */}
            <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6 justify-center">List New Scrap Item</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Image Upload */}
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text">Upload Scrap Image</span>
                            </label>
                            <input type="file" className="file-input file-input-bordered w-full" onChange={handleFileChange} />
                        </div>

                        {/* Category */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Select Category</span>
                            </label>
                            <select name="category" className="select select-bordered" value={formData.category} onChange={handleInputChange} required>
                                <option value="" disabled>Pick a category</option>
                                <option value="Metals">Metals</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Plastic">Plastic</option>
                                <option value="Paper">Paper</option>
                                <option value="Glass">Glass</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Expected Price ($)</span>
                            </label>
                            <input type="number" name="price" placeholder="Enter price" className="input input-bordered" value={formData.price} onChange={handleInputChange} required />
                        </div>

                        {/* Quantity */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Quantity (kg/ton)</span>
                            </label>
                            <input type="number" name="quantity" placeholder="Enter quantity" className="input input-bordered" value={formData.quantity} onChange={handleInputChange} required />
                        </div>

                        {/* Location */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <input type="text" name="location" placeholder="Enter pickup location" className="input input-bordered" value={formData.location} onChange={handleInputChange} required />
                        </div>

                        {/* Contact Number */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Contact Number</span>
                            </label>
                            <input type="tel" name="contactNumber" placeholder="Enter phone number" className="input input-bordered" value={formData.contactNumber} onChange={handleInputChange} required />
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name="email" placeholder="Enter email" className="input input-bordered" value={formData.email} onChange={handleInputChange} required />
                        </div>

                        {/* Description */}
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea name="description" className="textarea textarea-bordered h-24" placeholder="Describe the condition and type of scrap..." value={formData.description} onChange={handleInputChange}></textarea>
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name="password" placeholder="Enter password" className="input input-bordered" value={formData.password} onChange={handleInputChange} required />
                        </div>

                        {/* Confirm Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input type="password" name="confirmPassword" placeholder="Confirm password" className="input input-bordered" value={formData.confirmPassword} onChange={handleInputChange} required />
                        </div>

                        {/* Submit Button */}
                        <div className="form-control md:col-span-2 mt-6">
                            <button type="submit" className="btn btn-primary w-full">Submit Listing</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}