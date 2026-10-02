import { Link } from "react-router-dom";

function AlbumPreview({ album }) {
    return (
        <Link to={`/album/${album._id}`} className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <h4 className="font-display text-muse-mauve font-semibold">{album.name}</h4>
            <p className="text-sm text-muse-dark/70">{album.description}</p>
        </Link>
    );
}

export default AlbumPreview;