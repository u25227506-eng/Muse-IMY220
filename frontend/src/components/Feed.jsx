import PostPreview from "./PostPreview";

function Feed ({posts}){
    return (
        <div>
            {posts.map((post) => (
                <PostPreview key={post.id} post={post} />
            ))}
        </div>
    );
}

export default Feed;
