import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { name: "Dashboard", path: "/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
        { name: "Products", path: "/admin/products", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
        { name: "Users", path: "/admin/users", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    ];

    const handleLogout = () => {
        // Clear auth token (simulated)
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-base-200 flex">
            {/* Sidebar */}
            <aside className={`bg-base-100 w-64 shadow-xl flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-50'}`}>
                <div className="p-4 border-b border-base-300 flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-primary">ScrapX Admin</Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="btn btn-ghost btn-sm md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <ul className="menu p-4 flex-1 gap-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={location.pathname === item.path ? 'active' : ''}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="p-4 border-t border-base-300">
                    <button onClick={handleLogout} className="btn btn-outline btn-error w-full gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
                {/* Mobile Header */}
                <div className="navbar bg-base-100 shadow-sm md:hidden">
                    <div className="flex-none">
                        <button className="btn btn-square btn-ghost" onClick={() => setIsSidebarOpen(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                    <div className="flex-1">
                        <span className="text-xl font-bold">Admin Panel</span>
                    </div>
                </div>

                <main className="p-6 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
