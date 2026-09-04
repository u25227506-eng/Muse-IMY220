import {Link} from "react-router-dom";

function PostPreview({post}){
    return (
        <div> 
            <Link to={`/profile/${post.userId}`}>{post.username}</Link>
            <img src={post.imageUrl} alt={post.caption} width="200"/>
            <p>{post.caption}</p>
            <Link to={`/post/${post.id}`}>View Post</Link>
        </div>
    );
}

export default PostPreview;

