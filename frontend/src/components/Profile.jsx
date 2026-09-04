function Profile({user}){
    return (
        <div>
            <img src={user.avatarUrl} alt={user.username} width="100"/>
            <h2>{user.username}</h2>
            <p>{user.bio}</p>
        </div>
    );
}

export default Profile;