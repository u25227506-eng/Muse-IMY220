import {useState} from "react";

function CreatePost() {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        console.log("New post: ", {caption, image});
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <textarea   
                placeholder="write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <button type="submit">Post</button>
        </form>
    );
}

export default CreatePost;