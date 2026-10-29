import Image from "./Image";
import Comments from "./Comments";
import Hashtags from "./Hashtags";

function Post({post}){
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-display text-muse-mauve font-semibold mb-2">{post.username}</h3>
            <Image src={`http://localhost:5000${post.imageUrl}`} alt={post.description} />
            <p className="text-muse-dark mt-3">{post.description}</p>
            <Hashtags tags={post.hashtags} />
            <Comments comments={post.comments}/>
        </div>
    );
}

export default Post;