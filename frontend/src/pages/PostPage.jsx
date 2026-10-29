import {useState, useEffect} from "react";
import Navigation from "../components/Navigation";
import Post from "../components/Post";
import EditPost from "../components/EditPost";
import { useParams, useNavigate, Link } from "react-router-dom";

function PostPage(){
    const {id} = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("museUser"));
    const [post, setPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [albums, setAlbums] = useState([]);
    const [reasons, setReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [postAlbums, setPostAlbums] = useState([]);

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

    useEffect(() => {
        fetch("http://localhost:5000/api/reasons")
            .then(res => res.json())
            .then(data => setReasons(data));
    }, []);

    function loadPostAlbums(){
        fetch(`http://localhost:5000/api/posts/${id}/albums`)
            .then(res => res.json())
            .then(data => setPostAlbums(data));
    }

    async function handleAddToAlbum(e){
        const albumId = e.target.value;
        if (!albumId) return;
        await fetch(`http://localhost:5000/api/albums/${albumId}/posts`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({ postId: id }),
        });
        e.target.value = "";      // put the dropdown back to "Add to album..."
        loadPostAlbums();         // refresh the "In album" line straight away
    }

    useEffect(() => { loadPostAlbums(); }, [id]);

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

    async function handleReport(e){
        e.preventDefault();
        if (!selectedReason){
            setReportMessage("Please choose a reason first.");
            return;
        }
        const response = await fetch(`http://localhost:5000/api/posts/${id}/report`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({ userId: currentUser._id, reason: selectedReason }),
        });
        const data = await response.json();
        if (response.ok){
            setReportMessage("Thanks, your report was sent.");
            setSelectedReason("");
        } else {
            setReportMessage(data.message);   // e.g. "You have already reported this post"
        }
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
                {postAlbums.length > 0 && (
                    <p className="text-sm text-muse-dark/70 mt-3">
                        In album: {postAlbums.map((a, i) => (
                            <span key={a._id}>
                                <Link to={`/album/${a._id}`} className="text-muse-mauve font-medium hover:underline">{a.name}</Link>
                                {i < postAlbums.length - 1 ? ", " : ""}
                            </span>
                        ))}
                    </p>
                )}
                
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
                        onChange={handleAddToAlbum}
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
                    <form onSubmit={handleReport} className="flex flex-col gap-2 mt-4">
                        <label htmlFor="report-reason" className="text-sm font-medium text-muse-dark">Report this post</label>
                        <div className="flex gap-2">
                            <select
                                id="report-reason"
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-muse-pink/50 bg-white text-muse-dark"
                            >
                                <option value="">Choose a reason...</option>
                                {reasons.map(r => <option key={r._id} value={r.reason}>{r.reason}</option>)}
                            </select>
                            <button type="submit" className="px-4 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-sm font-medium hover:bg-rose-200">
                                Report
                            </button>
                        </div>
                        {reportMessage && <p className="text-sm text-muse-dark/70">{reportMessage}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}

export default PostPage;