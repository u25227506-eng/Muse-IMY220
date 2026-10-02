function Comments({comments}){
    return (
        <div className="mt-4">
            <h4 className="font-display text-muse-dark font-semibold mb-2">Comments</h4>
            <div className="flex flex-col gap-1">
                {comments.map((comment) => (
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