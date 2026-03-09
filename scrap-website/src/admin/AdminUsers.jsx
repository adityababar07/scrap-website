
import { useState, useEffect } from "react";
import api from "../api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('customers/');
            // response.data is list of customers.
            // Map to component structure
            const mappedUsers = response.data.map(c => ({
                id: c.id,
                name: c.username, // Using username as name
                email: c.email,
                role: "User", // Default role
                status: c.is_active ? "Active" : "Banned"
            }));
            setUsers(mappedUsers);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        // This requires an endpoint to update User status via Customer or User ID.
        // CustomerSerializer has is_active read_only.
        // We need a custom action or use djoser admin endpoints if available.
        // For simplicity, let's just alert for now as backend support isn't fully ready for banning via Customer endpoint.
        alert("Toggle status requires backend admin privileges implementation.");
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`customers/${id}/`);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error("Failed to delete user", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">User Management</h1>

            <div className="card bg-base-100 shadow-xl overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <th>{user.id}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-error'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        className="btn btn-xs btn-outline"
                                        onClick={() => toggleStatus(user.id)}
                                    >
                                        {user.status === 'Active' ? 'Ban' : 'Unban'}
                                    </button>
                                    <button
                                        className="btn btn-xs btn-error btn-outline"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
