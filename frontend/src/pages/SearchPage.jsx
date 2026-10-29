import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import SearchInput from "../components/SearchInput";
import ProfilePreview from "../components/ProfilePreview";
import AlbumPreview from "../components/AlbumPreview";
import Feed from "../components/Feed";

function SearchPage(){
    const [searchParams] = useSearchParams();
    const q = searchParams.get("q") || "";  // the ?q=... part of the URL
    const [results, setResults] = useState(null);

    useEffect(() => {
        setResults(null);
        fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(q)}`)
            .then(res => res.json())
            .then(data => setResults(data))
            .catch(() => setResults({ users: [], posts: [], albums: [] }));   
    }, [q]);                                   

    const nothingFound = results && !results.users?.length && !results.posts?.length && !results.albums?.length;

    return (
        <div className="min-h-screen bg-muse-cream">
            <Navigation />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <SearchInput />
                <h2 className="font-display text-xl text-muse-dark my-4">Results for "{q}"</h2>

                {!results && <p className="text-muse-dark/60">Searching...</p>}
                {nothingFound && <p className="text-muse-dark/60">No results found.</p>}

                {results?.users?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-display text-lg text-muse-dark mb-2">Users</h3>
                        <div className="flex flex-col gap-2">
                            {results.users.map(user => (
                                <div key={user._id} className="bg-white rounded-xl shadow-sm p-3">
                                    <ProfilePreview user={user} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results?.posts?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-display text-lg text-muse-dark mb-2">Posts</h3>
                        <Feed posts={results.posts} />
                    </div>
                )}

                {results?.albums?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-display text-lg text-muse-dark mb-2">Albums</h3>
                        <div className="flex flex-col gap-2">
                            {results.albums.map(album => (
                                <AlbumPreview key={album._id} album={album} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;