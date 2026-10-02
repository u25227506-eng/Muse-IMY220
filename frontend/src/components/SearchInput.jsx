import { useState } from "react";

function SearchInput(){
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <input
            type="text"
            placeholder="search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-muse-pink bg-white focus:outline-none focus:ring-2 focus:ring-muse-mauve"
        />
    );
}

export default SearchInput;