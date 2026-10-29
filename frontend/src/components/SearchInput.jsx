import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

function SearchInput(){
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const q = searchParams.get("q") || "";         
    const [searchTerm, setSearchTerm] = useState(q);

    useEffect(() => {
        setSearchTerm(q);
    }, [q]);

    function handleChange(e){
        const value = e.target.value;
        setSearchTerm(value);
        if (value === "" && location.pathname === "/search"){
            navigate("/home");
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        if (searchTerm.trim() === "") return;
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }

    return (
        <form onSubmit={handleSubmit} role="search" className="flex gap-2">
            <label htmlFor="search-input" className="sr-only">Search users, posts, albums and hashtags</label>
            <input
                id="search-input"
                type="text"
                placeholder="search users, posts, albums, #hashtags..."
                value={searchTerm}
                onChange={handleChange}
                className="flex-1 px-4 py-2 rounded-full border border-muse-pink bg-white focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream text-sm font-medium hover:bg-muse-dark transition-colors">
                Search
            </button>
        </form>
    );
}

export default SearchInput;