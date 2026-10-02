import {Link} from "react-router-dom";

function Friend ({friend}){
    return (
        <Link to={`/profile/${friend._id}`} className="flex items-center gap-2 bg-white rounded-full pr-4 py-1 shadow-sm hover:shadow-md transition-shadow w-fit">
            <img src={friend.avatarUrl} alt={friend.username} className="w-9 h-9 rounded-full object-cover" />
            <span className="text-muse-dark font-medium">{friend.username}</span>
        </Link>
    );
}

export default Friend;