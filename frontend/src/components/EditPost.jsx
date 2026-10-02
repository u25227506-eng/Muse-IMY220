import {useState} from "react";

function EditPost({post, onSave}){
    const [description, setDescription] = useState(post.description);
    const [hashtags, setHashtags] = useState(post.hashtags?.join(", "));

    async function handleSubmit(e){
        e.preventDefault();
        await fetch(`http://localhost:5000/api/posts/${post._id}`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({description, hashtags: hashtags.split(",").map(h => h.trim())}),
        });
        onSave();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white rounded-2xl shadow-sm p-5 my-3">
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream font-medium hover:bg-muse-dark transition-colors">
                Save
            </button>
        </form>
    );
}

export default EditPost;