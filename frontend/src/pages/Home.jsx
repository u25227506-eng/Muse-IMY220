import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Navigation from "../components/Navigation";
import Feed from "../components/Feed";
import SearchInput from "../components/SearchInput";

function Home(){
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("museUser"));
    const userId = user?._id;               
    const [posts, setPosts] = useState([]);
    const [feedType, setFeedType] = useState("local");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        if (!userId){
            navigate("/");
            return;
        }
        const url = feedType === "local"
            ? `http://localhost:5000/api/users/${userId}/feed`
            : `http://localhost:5000/api/posts`;

        fetch(url)
            .then(res => {
                if (res.status === 404){                 
                    localStorage.removeItem("museUser");
                    navigate("/");
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setPosts(data); 
            });
    }, [feedType, userId, navigate]);

    if (!user) return null;

    // sort 
    const sortedPosts = [...posts].sort((a, b) => {
        if (sortBy === "comments"){
            const diff = (b.comments?.length || 0) - (a.comments?.length || 0);
            if (diff !== 0) return diff;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const tabClass = (active) =>
        `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? "bg-muse-mauve text-muse-cream" : "bg-white text-muse-dark border border-muse-pink"}`;

    return (
        <div className="min-h-screen bg-muse-cream">
            <Navigation />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <SearchInput />
                <div className="flex flex-wrap items-center gap-3 my-4">
                    <button onClick={() => setFeedType("local")} className={tabClass(feedType === "local")}>Local Feed</button>
                    <button onClick={() => setFeedType("global")} className={tabClass(feedType === "global")}>Global Feed</button>
                    <div className="flex items-center gap-2 ml-auto">
                        <label htmlFor="sort-select" className="text-sm text-muse-dark">Sort by</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 rounded-full border border-muse-pink bg-white text-sm text-muse-dark"
                        >
                            <option value="newest">Newest</option>
                            <option value="comments">Most commented</option>
                        </select>
                    </div>
                </div>
                <Feed posts={sortedPosts} />
            </div>
        </div>
    );
}

export default Home;