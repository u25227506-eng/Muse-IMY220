function Comments({comments}){
    return (
        <div>
            {comments.map((comment) => (
                <p key={comment.id}>
                    <strong>{comment.username}: </strong> {comment.text}
                </p>
            ))}
        </div>
    );
}

export default Comments;