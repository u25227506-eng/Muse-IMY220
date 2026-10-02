import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import PostPreview from "../components/PostPreview";

function AlbumPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("museUser"));
    const [album, setAlbum] = useState(null);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    function loadAlbum() {
        fetch(`http://localhost:5000/api/albums/${id}`)
            .then(res => res.json())
            .then(data => {
                setAlbum(data);
                setName(data.name);
                setDescription(data.description);
            });
    }

    useEffect(() => { loadAlbum(); }, [id]);

    const isOwner = currentUser && album && currentUser._id === album.userId;

    async function handleSaveEdit(e) {
        e.preventDefault();
        await fetch(`http://localhost:5000/api/albums/${id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ name, description, hashtags: album.hashtags }),
        });
        setEditing(false);
        loadAlbum();
    }

    async function handleDelete() {
        await fetch(`http://localhost:5000/api/albums/${id}`, { method: "DELETE" });
        navigate(`/profile/${currentUser._id}`);
    }

    async function handleRemovePost(postId) {
        await fetch(`http://localhost:5000/api/albums/${id}/posts/${postId}`, { method: "DELETE" });
        loadAlbum();
    }

    if (!album) return <div className="min-h-screen bg-muse-cream"><Navigation /><p className="text-center text-muse-dark py-8">Loading...</p></div>;

    return (
        <div className="min-h-screen bg-muse-cream">
            <Navigation />
            <div className="max-w-2xl mx-auto px-4 py-6">
                {!editing ? (
                    <div className="mb-4">
                        <h2 className="font-display text-2xl font-bold text-muse-dark">{album.name}</h2>
                        <p className="text-muse-dark/70">{album.description}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSaveEdit} className="flex flex-col gap-3 bg-white rounded-2xl shadow-sm p-5 mb-4">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
                        />
                        <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream font-medium hover:bg-muse-dark transition-colors">
                            Save
                        </button>
                    </form>
                )}

                {isOwner && !editing && (
                    <div className="flex gap-3 mb-6">
                        <button onClick={() => setEditing(true)} className="px-4 py-1.5 rounded-full bg-white border border-muse-pink text-muse-dark text-sm font-medium hover:bg-muse-pink/20">
                            Edit Album
                        </button>
                        <button onClick={handleDelete} className="px-4 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-sm font-medium hover:bg-rose-200">
                            Delete Album
                        </button>
                    </div>
                )}

                <h4 className="font-display text-lg text-muse-dark mb-3">Posts in this album</h4>
                <div className="flex flex-col gap-3">
                    {album.posts?.map((post) => (
                        <div key={post._id} className="relative">
                            <PostPreview post={post} />
                            {isOwner && (
                                <button
                                    onClick={() => handleRemovePost(post._id)}
                                    className="mt-1 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-medium hover:bg-rose-200"
                                >
                                    Remove from album
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AlbumPage;