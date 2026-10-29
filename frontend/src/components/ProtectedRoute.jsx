import { Navigate } from "react-router-dom";

// wraps a page: no logged-in user means back to the splash page
function ProtectedRoute({ children }) {
    if (!localStorage.getItem("museUser")) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;