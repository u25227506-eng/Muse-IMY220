import {Link} from "react-router-dom";

function ProfilePreview({user}) {
    return(
        <div>
            <img src={user.avatarUrl} alt={user.username} width="40" />
            <Link to={`/profile/${user.id}`}>{user.username}</Link>
        </div>
    );

}

export default ProfilePreview;