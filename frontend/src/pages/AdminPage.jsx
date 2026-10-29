import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Avatar from "../components/Avatar";

const btnClass = "px-3 py-1 rounded-full bg-white border border-muse-pink text-muse-dark text-xs font-medium hover:bg-muse-pink/20";
const dangerClass = "px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-medium hover:bg-rose-200";

function AdminPage(){
    const currentUser = JSON.parse(localStorage.getItem("museUser"));
    const adminId = currentUser?._id;

    const [reported, setReported] = useState([]);
    const [reasons, setReasons] = useState([]);
    const [users, setUsers] = useState([]);
    const [newReason, setNewReason] = useState("");
    const [message, setMessage] = useState("");
    const [confirmUserId, setConfirmUserId] = useState("");   // which user's delete button is waiting for a second click

    // fetches the three lists; the Array.isArray checks mean an error reply can never crash the page
    function loadAll(){
        fetch(`http://localhost:5000/api/admin/reported?adminId=${adminId}`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setReported(data); });
        fetch("http://localhost:5000/api/reasons")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setReasons(data); });
        fetch(`http://localhost:5000/api/users?adminId=${adminId}`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setUsers(data); });
    }

    useEffect(() => { if (currentUser?.isAdmin) loadAll(); }, []);

    // regular users who type /admin are sent back to the feed
    if (!currentUser || !currentUser.isAdmin){
        return <Navigate to="/home" replace />;
    }

    async function dismissReports(postId){
        await fetch(`http://localhost:5000/api/admin/posts/${postId}/dismiss-reports`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({ adminId }),
        });
        setMessage("Reports removed.");
        loadAll();
    }

    async function deletePost(postId){
        await fetch(`http://localhost:5000/api/posts/${postId}`, { method: "DELETE" });
        setMessage("Post deleted.");
        loadAll();
    }

    async function addReason(e){
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/reasons", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({ adminId, reason: newReason }),
        });
        const data = await response.json();
        if (response.ok){
            setMessage(`Added the reason "${data.reason}".`);
            setNewReason("");
            loadAll();
        } else {
            setMessage(data.message);
        }
    }

    async function deleteUser(userId){
        if (confirmUserId !== userId){
            setConfirmUserId(userId);        // first click only asks "are you sure?"
            return;
        }
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}?adminId=${adminId}`, { method: "DELETE" });
        const data = await response.json();
        setMessage(data.message);
        setConfirmUserId("");
        loadAll();
    }

    return (
        <div className="min-h-screen bg-muse-cream">
            <Navigation />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <h2 className="font-display text-2xl font-bold text-muse-dark mb-4">Admin</h2>
                {message && <p className="text-sm text-muse-dark/70 mb-4">{message}</p>}

                <h3 className="font-display text-lg text-muse-dark mb-2">Reported posts</h3>
                {reported.length === 0 && <p className="text-sm text-muse-dark/60 mb-4">No reported posts.</p>}
                <div className="flex flex-col gap-3 mb-8">
                    {reported.map(post => (
                        <div key={post._id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
                            <img src={`http://localhost:5000${post.imageUrl}`} alt={post.description} className="w-24 h-24 rounded-xl object-cover" />
                            <div className="flex-1 flex flex-col gap-1">
                                <Link to={`/post/${post._id}`} className="font-medium text-muse-mauve hover:underline">{post.description}</Link>
                                <p className="text-sm text-muse-dark/70">by {post.username}, reported {post.reportCount} time(s)</p>
                                <p className="text-sm text-muse-dark/70">Reasons: {(post.reports || []).map(r => r.reason).join(", ")}</p>
                                <div className="flex gap-2 mt-1">
                                    <button onClick={() => dismissReports(post._id)} className={btnClass}>Remove reports</button>
                                    <button onClick={() => deletePost(post._id)} className={dangerClass}>Delete post</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="font-display text-lg text-muse-dark mb-2">Report reasons</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    {reasons.map(r => (
                        <span key={r._id} className="px-3 py-1 rounded-full bg-white border border-muse-pink text-sm text-muse-dark">{r.reason}</span>
                    ))}
                </div>
                <form onSubmit={addReason} className="flex flex-col gap-2 mb-8">
                    <label htmlFor="new-reason" className="text-sm font-medium text-muse-dark">Add a new reason</label>
                    <div className="flex gap-2">
                        <input
                            id="new-reason"
                            type="text"
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-muse-pink/50 bg-white focus:outline-none focus:ring-2 focus:ring-muse-mauve"
                        />
                        <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream text-sm font-medium hover:bg-muse-dark">Add</button>
                    </div>
                </form>

                <h3 className="font-display text-lg text-muse-dark mb-2">Users</h3>
                <div className="flex flex-col gap-2">
                    {users.map(user => (
                        <div key={user._id} className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
                            <Avatar user={user} className="w-9 h-9" />
                            <Link to={`/profile/${user._id}`} className="flex-1 text-muse-dark font-medium hover:underline">
                                {user.username}{user.isAdmin ? " (admin)" : ""}
                            </Link>
                            {user._id !== currentUser._id && (
                                <button onClick={() => deleteUser(user._id)} className={dangerClass}>
                                    {confirmUserId === user._id ? "Click again to confirm" : "Delete account"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;