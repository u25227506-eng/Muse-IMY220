import { useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import Post from "../components/Post";
import art1 from "../assets/art1.jpg";

const dummyPost = {
    id: 1, username: "tshidi", imageUrl: art1, caption: "art day", 
    comments: [
        {id: 1, username: "samuel", text: "Love this!"}
    ],
};

function PostPage(){
    const {id} = useParams();

    return (
        <div>
            <Navigation />
            <p>Viewing post id: {id}</p>
            <Post post={dummyPost} />

        </div>
    );
}

export default PostPage;