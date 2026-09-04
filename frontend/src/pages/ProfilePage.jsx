import { useParams} from "react-router-dom";
import Navigation from "../components/Navigation";
import Profile from "../components/Profile";
import Friend from "../components/Friend";
import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";

const dummyUserPosts = [
    { id: 3, userId: 1, username: "tshidi", imageUrl: "https://via.placeholder.com/200", caption: "My latest work" },
];

const dummyUser = {
    id: 1,
    username: "tshidi",
    bio: "artsy, loves photography",
    avatarUrl: "https://via.placeholder.com/100",

};

const dummyFriends = [
    {id: 2, username: "samuel", avatarUrl: "https://via.placeholder.com/50"},
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
