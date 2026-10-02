import Image from "./Image";
import Comments from "./Comments";

function Post({post}){
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-display text-muse-mauve font-semibold mb-2">{post.username}</h3>
            <Image src={`http://localhost:5000${post.imageUrl}`} alt={post.description} />
            <p className="text-muse-dark mt-3">{post.description}</p>
            <p className="text-sm text-muse-mauve mt-1">{post.hashtags?.join(" ")}</p>
            <Comments comments={post.comments}/>
        </div>
    );
}

export default Post;