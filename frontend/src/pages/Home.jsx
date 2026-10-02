import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Navigation from "../components/Navigation";
import Feed from "../components/Feed";
import SearchInput from "../components/SearchInput";

function Home(){
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("museUser"));
    const [posts, setPosts] = useState([]);
    const [feedType, setFeedType] = useState("local");

    useEffect(() => {
        if (!user){
            navigate("/");
            return;
        }
        const url = feedType === "local"
            ? `http://localhost:5000/api/users/${user._id}/feed`
            : `http://localhost:5000/api/posts`;

        fetch(url)
            .then(res => res.json())
            .then(data => setPosts(data));
    }, [feedType, user, navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-muse-cream">
            <Navigation />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <SearchInput />
                <div className="flex gap-3 my-4">
                    <button
                        onClick={() => setFeedType("local")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${feedType === "local" ? "bg-muse-mauve text-muse-cream" : "bg-white text-muse-dark border border-muse-pink"}`}
                    >
                        Local Feed
                    </button>
                    <button
                        onClick={() => setFeedType("global")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${feedType === "global" ? "bg-muse-mauve text-muse-cream" : "bg-white text-muse-dark border border-muse-pink"}`}
                    >
                        Global Feed
                    </button>
                </div>
                <Feed posts={posts} />
            </div>
        </div>
    );
}

export default Home;