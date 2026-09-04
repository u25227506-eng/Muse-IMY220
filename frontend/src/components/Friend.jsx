import {Link} from "react-router-dom";

function Friend ({friend}){
    return (
        <div>
            <img src={friend.avatarUrl} alt={friend.username} width="50" />
            <Link to={`/profile/${friend.id}`}>{friend.username}</Link>
        </div>
    );
}

export default Friend;

