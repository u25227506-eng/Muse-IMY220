import {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Post from "../components/Post";
import EditPost from "../components/EditPost";

function PostPage(){
    const {id} = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("museUser"));
    const [post, setPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [albums, setAlbums] = useState([]);

    function loadPost(){
        fetch(`http://localhost:5000/api/posts/${id}`)
            .then(res => res.json())
            .then(data => setPost(data));
    }

    useEffect(() => {loadPost(); }, [id]);
    useEffect(() => {
        if (currentUser) {
            fetch(`http://localhost:5000/api/users/${currentUser._id}/albums`)
                .then(res => res.json())
                .then(data => setAlbums(data));
        }
    }, [currentUser]);

    async function handleAddComment(e){
        e.preventDefault();
        if(!commentText.trim()) return;
        await fetch(`http://localhost:5000/api/posts/${id}/comments`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({userId: currentUser._id, username: currentUser.username, text: commentText}),
        });
        setCommentText("");
        loadPost();
    }

    async function handleDelete(){
        await fetch(`http://localhost:5000/api/posts/${id}`, {method: "DELETE"});
        navigate("/home");
    }

    async function handleReport(){
        await fetch(`http://localhost:5000/api/posts/${id}/report`, { method: "POST" });
        alert("Post reported");
    }

    if (!post){
        return (
            <div className="min-h-screen bg-muse-cream">
                <Navigation />
                <p className="text-center text-muse-dark py-8">Loading...</p>
            </div>
        );
    }

    const isOwner = currentUser && currentUser._id === post.userId;

    return (
        <div className="min-h-screen bg-muse-cream">
            <Navigation />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <Post post={post} />

                {isOwner && !editing && (
                    <div className="flex gap-3 my-4">
                        <button onClick={() => setEditing(true)} className="px-4 py-1.5 rounded-full bg-white border border-muse-pink text-muse-dark text-sm font-medium hover:bg-muse-pink/20">
                            Edit Post
                        </button>
                        <button onClick={handleDelete} className="px-4 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-sm font-medium hover:bg-rose-200">
                            Delete Post
                        </button>
                    </div>
                )}

                {isOwner && editing && (
                    <EditPost post={post} onSave={() => {setEditing(false); loadPost(); }} />
                )}

                {isOwner && albums.length > 0 && (
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                fetch(`http://localhost:5000/api/albums/${e.target.value}/posts`, {
                                    method: "POST",
                                    headers: {"Content-type": "application/json"},
                                    body: JSON.stringify({ postId: post._id }),
                                });
                            }
                        }}
                        className="my-3 px-4 py-2 rounded-lg border border-muse-pink/50 bg-white text-muse-dark"
                    >
                        <option value="">Add to album...</option>
                        {albums.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                )}

                <form onSubmit={handleAddComment} className="flex gap-2 my-4">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-full border border-muse-pink/50 bg-white focus:outline-none focus:ring-2 focus:ring-muse-mauve"
                    />
                    <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream text-sm font-medium hover:bg-muse-dark">
                        Comment
                    </button>
                </form>

                {!isOwner && (
                    <button onClick={handleReport} className="px-4 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-sm font-medium hover:bg-rose-200">
                        Report Post
                    </button>
                )}
            </div>
        </div>
    );
}

export default PostPage;