
import { useState, useEffect } from "react";
import api from "../api";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_orders: 0,
        new_users: 0,
        total_revenue: 0
    });
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('admin-dashboard/');
                setStats(response.data.stats);
                setActivity(response.data.recent_activity);
            } catch (error) {
                console.error("Failed to fetch admin dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="stat-title">Total Orders</div>
                        <div className="stat-value text-primary">{stats.total_orders}</div>
                        <div className="stat-desc">All time</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </div>
                        <div className="stat-title">New Users</div>
                        <div className="stat-value text-secondary">{stats.new_users}</div>
                        <div className="stat-desc">Last 30 days</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                        </div>
                        <div className="stat-title">Total Revenue</div>
                        <div className="stat-value text-accent">₹{stats.total_revenue}</div>
                        <div className="stat-desc">All time</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Recent Activity</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activity.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.user}</td>
                                        <td>{item.action}</td>
                                        <td>{item.date}</td>
                                    </tr>
                                ))}
                                {activity.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center">No recent activity.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
