import { useState } from "react";
import PostPreview from "./PostPreview";

function Feed ({posts, pageSize = 5}){
    const [visibleCount, setVisibleCount] = useState(pageSize);   // start by showing 5 posts

    return (
        <div className="flex flex-col gap-4">
            {posts.length === 0 && <p className="text-center text-muse-dark/60 py-4">No posts to show yet.</p>}

            {posts.slice(0, visibleCount).map((post) => (
                <PostPreview key={post._id} post={post} />
            ))}

            {posts.length > visibleCount && (
                <button
                    onClick={() => setVisibleCount(visibleCount + pageSize)}
                    className="mx-auto px-5 py-2 rounded-full bg-white border border-muse-pink text-muse-dark text-sm font-medium hover:bg-muse-pink/20"
                >
                    Show more
                </button>
            )}
        </div>
    );
}

export default Feed;