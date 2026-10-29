import { useState } from "react";
import { Link } from "react-router-dom";

function Comments({ comments, limit = 5, moreLink }) {
    const [showAll, setShowAll] = useState(false);
    const list = comments || [];
    const visible = showAll ? list : list.slice(-limit);   // slice(-5) = the 5 newest comments
    const hiddenCount = list.length - visible.length;

    return (
        <div className="mt-4">
            <h4 className="font-display text-muse-dark font-semibold mb-2">Comments</h4>

            {list.length === 0 && <p className="text-sm text-muse-dark/60">No comments yet.</p>}

            {hiddenCount > 0 && (
                moreLink ? (
                    <Link to={moreLink} className="text-sm text-muse-mauve font-medium hover:underline">
                        View all {list.length} comments
                    </Link>
                ) : (
                    <button onClick={() => setShowAll(true)} className="text-sm text-muse-mauve font-medium hover:underline">
                        Show all {list.length} comments
                    </button>
                )
            )}

            <div className="flex flex-col gap-1 mt-1">
                {visible.map((comment) => (
                    <p key={comment._id} className="text-sm text-muse-dark">
                        <span className="font-semibold text-muse-mauve">{comment.username}: </span>
                        {comment.text}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Comments;