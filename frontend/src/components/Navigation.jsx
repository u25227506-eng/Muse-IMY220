import {Link, useNavigate} from "react-router-dom";

function Navigation(){
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("museUser"));

    function handleLogout(){
        localStorage.removeItem("museUser");
        navigate("/");
    }

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-muse-mauve text-muse-cream shadow-md">
            <div className="flex items-center gap-6">
                <Link to="/home" className="font-display text-2xl font-bold tracking-wide">Muse</Link>
                <Link to="/home" className="hover:text-muse-pink transition-colors">Home</Link>
                {user && <Link to={`/profile/${user._id}`} className="hover:text-muse-pink transition-colors">Profile</Link>}
            </div>
            {user && (
                <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 rounded-full bg-muse-pink text-muse-dark text-sm font-medium hover:bg-muse-cream transition-colors"
                >
                    Log Out
                </button>
            )}
        </nav>
    );
}

export default Navigation;