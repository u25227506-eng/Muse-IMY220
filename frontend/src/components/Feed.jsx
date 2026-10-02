import PostPreview from "./PostPreview";

function Feed ({posts}){
    return (
        <div className="flex flex-col gap-4">
            {posts.map((post) => (
                <PostPreview key={post._id} post={post} />
            ))}
        </div>
    );
}

export default Feed;