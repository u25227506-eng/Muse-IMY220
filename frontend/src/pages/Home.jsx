import Navigation from "../components/Navigation";
import Feed from "../components/Feed";
import SearchInput from "../components/SearchInput";

const dummyPosts =[
    {id: 1, userId: 1, username: "tshidi", imageUrl: "https://via.placeholder.com/200", caption: "Art day"},
    {id: 2, userId: 2, username: "samuel", imageUrl: "https://via.placeholder.com/200", caption: "sunset shot"}
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
