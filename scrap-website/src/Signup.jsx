import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        // Dummy registration
        if (name && email && password) {
            // In a real app, you'd send this to a backend
            console.log("Registered:", { name, email, password });

            // For now, let's just log them in directly or redirect to login
            localStorage.setItem("token", "dummy-token");
            navigate("/buy");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold text-base-content">Sign Up</h2>
                    <form onSubmit={handleSignup}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-base-content">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                        </div>
                        <div className="card-actions justify-end mt-4">
                            <button className="btn btn-primary w-full">Sign Up</button>
                        </div>
                    </form>
                    <div className="divider text-base-content/50">OR</div>
                    <div className="text-center text-base-content">
                        Already have an account? <Link to="/login" className="link link-primary">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
