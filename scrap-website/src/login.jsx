import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "./CartContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { fetchCart } = useCart();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}/auth/token/login/`, {
                email,
                password
            }); 
            // So URL is ${import.meta.env.VITE_BASE_URL}/auth/...
            // The api instance is ${import.meta.env.VITE_API_URL} (with /api/)

            // I'll import axios directly for this file or just use the full URL.
            // Let's just standard axios for now to avoid confusion.

            const token = response.data.auth_token;
            localStorage.setItem("token", token);
            await fetchCart(); // Refresh cart with user data
            navigate("/buy");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed! Check credentials.");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold text-base-content">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-base-content">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-base-content">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="label">
                                <span className="label-text-alt link link-hover text-base-content/70">Forgot password?</span>
                            </label>
                        </div>
                        <div className="card-actions justify-end mt-4">
                            <button className="btn btn-primary w-full">Sign in</button>
                        </div>
                    </form>
                    <div className="divider text-base-content/50">OR</div>
                    <div className="text-center text-base-content">
                        Don't have an account? <Link to="/signup" className="link link-primary">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
