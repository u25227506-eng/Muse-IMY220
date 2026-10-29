import {useState} from "react";
import {Link} from "react-router-dom";
import Hashtags from "./Hashtags";


function PostPreview({post}){
    const [showAnyway, setShowAnyway] = useState(false);
    const hidden = post.reportCount > 2 && !showAnyway;   // more than 2 reports: cover it with a message

    if (hidden){
        return (
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2 text-center">
                <p className="text-muse-dark/70">This post has been reported and is hidden.</p>
                <button onClick={() => setShowAnyway(true)} className="px-4 py-1.5 rounded-full bg-white border border-muse-pink text-muse-dark text-sm font-medium hover:bg-muse-pink/20">
                    View anyway
                </button>
            </div>
        );
    }

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
            <Hashtags tags={post.hashtags} />
            <Link to={`/post/${post._id}`} className="text-sm text-muse-mauve font-medium hover:underline w-fit">
                View Post
            </Link>
        </div>
    );
}

export default PostPreview;