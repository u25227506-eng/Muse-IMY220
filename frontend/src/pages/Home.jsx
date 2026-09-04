import Navigation from "../components/Navigation";
import Feed from "../components/Feed";
import SearchInput from "../components/SearchInput";
import art1 from "../assets/art1.jpg";
import sunset from "../assets/sunset.jpg";

const dummyPosts =[
    {id: 1, userId: 1, username: "tshidi", imageUrl: art1, caption: "Art day"},
    {id: 2, userId: 2, username: "samuel", imageUrl: sunset, caption: "sunset shot"}
];

function Home(){
    return (
        <div>
                <Navigation />
                <SearchInput />
                <Feed posts={dummyPosts} />

        </div>
    );
}

export default Home;
