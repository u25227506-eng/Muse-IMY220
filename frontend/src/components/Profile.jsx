import Avatar from "./Avatar";

function Profile({user, showBio = true}){
    return (
        <div className="flex flex-col items-center gap-2 py-6">
            <Avatar user={user} className="w-24 h-24 border-4 border-muse-pink" />
            <h2 className="font-display text-2xl font-bold text-muse-dark">{user.username}</h2>
            {showBio && <p className="text-muse-dark/70 text-center max-w-md">{user.bio}</p>}
        </div>
    );
}

export default Profile;