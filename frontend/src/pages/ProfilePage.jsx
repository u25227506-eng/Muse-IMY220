import { useParams} from "react-router-dom";
import Navigation from "../components/Navigation";
import Profile from "../components/Profile";
import Friend from "../components/Friend";
import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";
import avatar1 from "../assets/avatar1.jpg";
import avatar2 from "../assets/avatar2.jpg";
import art2 from "../assets/art2.jpg";

const dummyUserPosts = [
    { id: 3, userId: 1, username: "tshidi", imageUrl: art2, caption: "My latest work" },
];

const dummyUser = {
    id: 1,
    username: "tshidi",
    bio: "artsy, loves photography",
    avatarUrl: avatar1,

};

const dummyFriends = [
    {id: 2, username: "samuel", avatarUrl: avatar2},
];

function ProfilePage(){
    const {id} = useParams();

    return (
        <div>
            <Navigation />
            <p>Viewing profile id: {id}</p>
            <Profile user={dummyUser} />
            {dummyFriends.map((friend) => (
                <Friend key={friend.id} friend={friend} />
            ))}
            <Feed posts={dummyUserPosts} />
            <CreatePost />

        </div>
    );
}

export default ProfilePage;
