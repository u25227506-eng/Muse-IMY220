function Profile({user}){
    return (
        <div className="flex flex-col items-center gap-2 py-6">
            {user.avatarUrl && (
                <img src={user.avatarUrl} alt={user.username} className="w-24 h-24 rounded-full object-cover border-4 border-muse-pink" />
            )}
            <h2 className="font-display text-2xl font-bold text-muse-dark">{user.username}</h2>
            <p className="text-muse-dark/70 text-center max-w-md">{user.bio}</p>
        </div>
    );
}

export default Profile;