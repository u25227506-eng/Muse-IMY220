import { useState } from "react";


function SearchInput(){
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <input 
            type="text"
            placeholder="search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    );
}

export default SearchInput;