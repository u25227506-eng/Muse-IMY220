import {useState} from "react";
import {useNavigate} from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("museUser"));
    const [description, setDescription] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [imageFile, setImageFile] = useState(null)

    async function handleSubmit(e){
        e.preventDefault();
        if (!imageFile){
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
            navigate("/home");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white rounded-2xl shadow-sm p-5 max-w-sm mx-auto my-4">
            <h3 className="font-display text-lg text-muse-dark">New Post</h3>

            <label className="px-4 py-2 rounded-full bg-muse-pink/40 text-muse-dark text-sm font-medium text-center cursor-pointer hover:bg-muse-pink/60 transition-colors">
                {imageFile ? imageFile.name : "Choose Image"}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                />
            </label>

            <textarea
                placeholder="write a caption..."
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
                Post
            </button>
        </form>
    );
}

export default CreatePost;