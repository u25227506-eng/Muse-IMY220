import { useState } from "react";

function CreateAlbum({ userId, onCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [hashtags, setHashtags] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const hashtagArray = hashtags ? hashtags.split(",").map(h => h.trim()) : [];
        const response = await fetch("http://localhost:5000/api/albums", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ userId, name, description, hashtags: hashtagArray }),
        });
        const album = await response.json();
        setName("");
        setDescription("");
        setHashtags("");
        onCreated(album);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white rounded-2xl shadow-sm p-5 max-w-sm">
            <h3 className="font-display text-lg text-muse-dark">New Album</h3>
            <input
                type="text"
                placeholder="album name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <textarea
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <input
                type="text"
                placeholder="hashtags (comma separated)"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream font-medium hover:bg-muse-dark transition-colors">
                Create Album
            </button>
        </form>
    );
}

export default CreateAlbum;