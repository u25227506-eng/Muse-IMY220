import {useState} from "react";

function EditPost({post}){
    const [caption, setCaption] = useState(post.caption);

    function handleSubmit(e){
        e.preventDefault();
        console.log("Updated post:", {caption});
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea   
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <button type="submit">Save</button>
        </form>
    );
}

export default EditPost;

