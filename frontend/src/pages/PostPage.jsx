import {useState, useEffect} from "react";
import { useParams} from "react-router-dom";
import Navigation from "../components/Navigation";
import Profile from "../components/Profile";
import Friend from "../components/Friend";
import CreatePost from "../components/CreatePost";
import EditProfile from "../components/EditProfile";
import Feed from "../components/Feed";
import CreateAlbum from "../components/CreateAlbum";
import AlbumPreview from "../components/AlbumPreview";
import DropZone from "../components/DropZone";

function ProfilePage(){
    const {id} = useParams();
    const currentUser = JSON.parse(localStorage.getItem("museUser"));
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [pictureMessage, setPictureMessage] = useState("");

    const isOwnProfile = currentUser && currentUser._id === id;

    useEffect(() => {
        fetch(`http://localhost:5000/api/users/${id}`)
            .then(res => res.json())
            .then(data => { if (data && data._id) setProfileUser(data); });

        fetch(`http://localhost:5000/api/users/${id}/posts`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setPosts(data); });

        fetch(`http://localhost:5000/api/users/${id}/albums`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setAlbums(data); });
    }, [id]);

    async function sendFriendRequest(){
        await fetch(`http://localhost:5000/api/users/${id}/friend-request`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({fromUserId: currentUser._id}),
        });
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        setProfileUser(await res.json());
    }

    async function acceptFriendRequest(friendId){
        await fetch(`http://localhost:5000/api/users/${currentUser._id}/accept-friend`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({friendId}),
        });
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        setProfileUser(await res.json());
    }

    async function handleUnfriend(){
        await fetch(`http://localhost:5000/api/users/${currentUser._id}/unfriend/${id}`, {
            method: "DELETE",
        });
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        setProfileUser(await res.json());
    }

    // uploads the chosen or dropped picture straight away
    async function handleAvatarFile(file){
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await fetch(`http://localhost:5000/api/users/${id}/avatar`, {
            method: "PUT",
            body: formData,
        });
        const data = await response.json();
        if (response.ok){
            setProfileUser({ ...profileUser, avatarUrl: data.avatarUrl });
            setPictureMessage("Profile picture updated.");
        } else {
            setPictureMessage(data.message || "Could not update the picture.");
        }
    }

    if (!profileUser){
        return (
            <div className="min-h-screen bg-muse-cream">
                <Navigation />
                <p className="text-center text-muse-dark py-8">Loading...</p>
            </div>
        );
    }

    const isFriend = profileUser.friends?.some(f => f._id === currentUser?._id);
    const requestPending = profileUser.friendRequests?.some(f => f._id === currentUser?._id);
    const theyRequestedYou = isOwnProfile && profileUser.friendRequests?.length > 0;
    const canSeeAll = isOwnProfile || isFriend || currentUser?.isAdmin;   // admins see every profile in full
    const canEditProfile = isOwnProfile || currentUser?.isAdmin;          // admins can edit any account

    return (
        <div className="min-h-screen bg-muse-cream">
            <Navigation />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <Profile user={profileUser} showBio={canSeeAll} />

                <div className="flex justify-center gap-3 mb-4">
                    {canEditProfile && !editing && (
                        <button onClick={() => setEditing(true)} className="px-4 py-1.5 rounded-full bg-white border border-muse-pink text-muse-dark text-sm font-medium hover:bg-muse-pink/20">
                            Edit Profile
                        </button>
                    )}
                    {!isOwnProfile && !isFriend && !requestPending && (
                        <button onClick={sendFriendRequest} className="px-4 py-1.5 rounded-full bg-muse-mauve text-muse-cream text-sm font-medium hover:bg-muse-dark">
                            Add Friend
                        </button>
                    )}
                    {!isOwnProfile && requestPending && (
                        <p className="text-sm text-muse-dark/60 self-center">Friend request sent</p>
                    )}
                    {!isOwnProfile && isFriend && (
                        <>
                            <span className="text-sm text-muse-dark/60 self-center">Friends</span>
                            <button onClick={handleUnfriend} className="px-4 py-1.5 rounded-full bg-white border border-muse-pink text-muse-dark text-sm font-medium hover:bg-muse-pink/20">
                                Unfriend
                            </button>
                        </>
                    )}
                </div>

                {canEditProfile && (
                    <div className="max-w-sm mx-auto mb-4">
                        <DropZone id="avatar-input" file={null} onFile={handleAvatarFile} label="Change profile picture: drag one here, or click to choose" />
                        {pictureMessage && <p className="text-sm text-muse-dark/70 text-center mt-2">{pictureMessage}</p>}
                    </div>
                )}

                {canEditProfile && editing && (
                    <EditProfile user={profileUser} onSave={(updated) => {
                        setProfileUser({ ...profileUser, username: updated.username, bio: updated.bio });
                        setEditing(false);
                    }} />
                )}

                {theyRequestedYou && profileUser.friendRequests.map(req => (
                    <div key={req._id} className="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 mb-3">
                        <p className="text-muse-dark">{req.username} wants to be friends</p>
                        <button onClick={() => acceptFriendRequest(req._id)} className="px-4 py-1 rounded-full bg-muse-mauve text-muse-cream text-sm font-medium hover:bg-muse-dark">
                            Accept
                        </button>
                    </div>
                ))}

                {(isOwnProfile || isFriend) && (
                    <div className="mb-6">
                        <h4 className="font-display text-lg text-muse-dark mb-2">Friends</h4>
                        <div className="flex flex-wrap gap-2">
                            {profileUser.friends?.map((friend) => (
                                <Friend key={friend._id} friend={friend} />
                            ))}
                        </div>
                    </div>
                )}

                {canSeeAll ? (
                    <>
                        <div className="mb-6">
                            <h4 className="font-display text-lg text-muse-dark mb-3">Posts</h4>
                            <Feed posts={posts} />
                        </div>

                        <div className="mb-6">
                            <h4 className="font-display text-lg text-muse-dark mb-2">Albums</h4>
                            <div className="flex flex-col gap-2 mb-3">
                                {albums.map((album) => (
                                    <AlbumPreview key={album._id} album={album} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-muse-dark/60 py-6">
                        Become friends with {profileUser.username} to see their bio, posts and albums.
                    </p>
                )}

                {isOwnProfile && (
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <CreateAlbum userId={currentUser._id} onCreated={(newAlbum) => setAlbums([...albums, newAlbum])} />
                        <CreatePost />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;