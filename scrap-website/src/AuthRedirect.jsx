import { Navigate } from "react-router-dom";

function AuthRedirect({ children }) {
    const isLoggedIn = localStorage.getItem("token");

    if (isLoggedIn) {
        return <Navigate to="/buy" replace />;
    }

    return children;
}

export default AuthRedirect;
