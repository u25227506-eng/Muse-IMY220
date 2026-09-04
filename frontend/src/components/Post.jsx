import Image from "./Image";
import Comments from "./Comments";

function Post({post}){
    return (
        <div>
            <h3>{post.username}</h3>
            <Image src={post.imageUrl} alt={post.caption} />
            <p> {post.caption}</p>
            <Comments comments={post.comments}/>

        </div>
    );
}

export default Post;