import { Link } from "react-router-dom";

// shows each hashtag as a link; clicking it runs the same search as typing it
function Hashtags({ tags }) {
    if (!tags || tags.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`} className="text-sm text-muse-mauve font-medium hover:underline">
                    #{tag}
                </Link>
            ))}
        </div>
    );
}

export default Hashtags;