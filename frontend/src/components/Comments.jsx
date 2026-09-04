function Comments({comments}){
    return (
        <div>
            <h2>Comments</h2>
            {comments.map((comment) => (
                <p key={comment.id}>
                    <strong>{comment.username}: </strong> {comment.text}
                </p>
            ))}
        </div>
    );
}

export default Comments;