import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchInput(){
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        if (searchTerm.trim() === "") return;
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);   // the term travels in the URL
    }

    return (
        <form onSubmit={handleSubmit} role="search" className="flex gap-2">
            <label htmlFor="search-input" className="sr-only">Search users, posts, albums and hashtags</label>
            <input
                id="search-input"
                type="text"
                placeholder="search users, posts, albums, #hashtags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full border border-muse-pink bg-white focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream text-sm font-medium hover:bg-muse-dark transition-colors">
                Search
            </button>
        </form>
    );
}

export default SearchInput;