import {Link} from "react-router-dom";

function PostPreview({post}){
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
            <Link to={`/profile/${post.userId}`} className="font-display text-muse-mauve font-semibold hover:underline">
                {post.username}
            </Link>
            <img
                src={`http://localhost:5000${post.imageUrl}`}
                alt={post.description}
                className="rounded-xl w-full max-h-80 object-cover"
            />
            <p className="text-muse-dark">{post.description}</p>
            <Link to={`/post/${post._id}`} className="text-sm text-muse-mauve font-medium hover:underline w-fit">
                View Post
            </Link>
        </div>
    );
}

export default PostPreview;