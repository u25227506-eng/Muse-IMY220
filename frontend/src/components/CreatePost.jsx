import {useState} from "react";
import {useNavigate} from "react-router-dom";
import DropZone from "./DropZone";

function CreatePost() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("museUser"));
    const [description, setDescription] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        if (!imageFile){
            setError("Please choose a picture first.");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("userId", user._id);
        formData.append("username", user.username);
        formData.append("description", description);
        formData.append("hashtags", hashtags);

        const response = await fetch("http://localhost:5000/api/posts", {
            method: "POST",
            body: formData,
        });
        if (response.ok){
            setDescription("");
            setHashtags("");
            setImageFile(null);
            setError("");
            navigate("/home");
        } else {
            setError("Could not create the post. Please try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white rounded-2xl shadow-sm p-5 max-w-sm mx-auto my-4">
            <h3 className="font-display text-lg text-muse-dark">New Post</h3>

            <DropZone id="create-post-image" file={imageFile} onFile={setImageFile} label="Drag a photo here, or click to choose" />

            <label htmlFor="create-post-caption" className="text-sm font-medium text-muse-dark">Caption</label>
            <textarea
                id="create-post-caption"
                placeholder="write a caption..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />

            <label htmlFor="create-post-hashtags" className="text-sm font-medium text-muse-dark">Hashtags (comma separated)</label>
            <input
                id="create-post-hashtags"
                type="text"
                placeholder="art, sunset"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream font-medium hover:bg-muse-dark transition-colors">
                Post
            </button>
        </form>
    );
}

export default CreatePost;