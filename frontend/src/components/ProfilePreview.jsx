import {Link} from "react-router-dom";
import Avatar from "./Avatar";

function ProfilePreview({user}) {
    return(
        <div className="flex items-center gap-2">
            <Avatar user={user} className="w-10 h-10" />
            <Link to={`/profile/${user._id}`}>{user.username}</Link>
        </div>
    );
}

export default ProfilePreview;