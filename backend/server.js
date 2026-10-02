import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Album from "./models/Album.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({storage});

//signing in/up

app.post("/api/signin", async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email, password});
        if (!user){
            return res.status(401).json({message: "Invalid email or password"});
        }
        res.json({message: "Sign in successful", user});
    } catch (err){
        res.status(500).json({message: "Signin error", error: err.message});
    }
});

app.post("/api/signup", async (req, res) => {
    try{
        const {username, email, password} = req.body;
        const existing = await User.findOne({email});
        if (existing){
            return res.status(400).json({message: "Email already in use"});
        }
        const user = new User({username, email, password});
        await user.save();
        res.json({message: "Sign up successful", user});
    } catch (err){
        res.status(500).json({message: "Signup error", error: err.message});
    }
});

//Users/Profile

app.get("/api/users/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
            .populate("friends", "username avatarUrl")
            .populate("friendRequests", "username avatarUrl");
        if(!user){
            return res.status(404).json({message: "User not found"});
        } 
        res.json(user);
    } catch (err){
         res.status(500).json({message: "Error fetching user", error: err.message});
    }
});

app.put("/api/users/:id", async (req, res) => {
    try{
        const {username, bio, avatarUrl } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {username, bio, avatarUrl},
            {new: true}
        );
        res.json(user);
    }catch (err){
        res.status(500).json({message: "Error updating profile", error: err.message});
    }
});

//friends
app.post("/api/users/:id/friend-request", async (req, res) => {
    try{
        const {fromUserId} = req.body;
        await User.findByIdAndUpdate(req.params.id, {
            $addToSet: {friendRequests: fromUserId}, 
        });

        res.json({ message: "Friend request sent"});
    }catch (err){
        res.status(500).json({message: "Error sending friend request", error: err.message});
    }
});

app.post("/api/users/:id/accept-friend", async (req, res) => {
    try{
        const {friendId} = req.body;
        await User.findByIdAndUpdate(req.params.id, {
            $addToSet: {friends: friendId}, 
            $pull: { friendRequests: friendId},
        });
        await User.findByIdAndUpdate(friendId, {
            $addToSet: {friends: req.params.id},
        });
        res.json({ message: "Friend request accepted"});
    }catch (err){
        res.status(500).json({message: "Error accepting friend request", error: err.message});
    }
});

app.delete("/api/users/:id/unfriend/:friendId", async (req, res) => {
    try{
        await User.findByIdAndUpdate(req.params.id, { 
            $pull: {friends: req.params.friendId}
        });
        await User.findByIdAndUpdate(req.params.friendId, { 
            $pull: {friends: req.params.id}
        });
        res.json({ message: "Unfriended"});
    }catch (err){
        res.status(500).json({message: "Error unfriending", error: err.message});
    }
});

//Posts

app.post("/api/posts", upload.single("image"), async (req, res) => {
    try{
        const {userId, username, description, hashtags} = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;
        const hashtagArray = hashtags ? hashtags.split(",").map( h => 
            h.trim()
        ) : [];

        const post = new Post({userId, username, imageUrl, description, hashtags: hashtagArray});
        await post.save();
        res.json(post);
    } catch (err){
        res.status(500).json({message: "Error creating post", error: err.message});
    }
});

//Global feed

app.get("/api/posts", async (req, res) => {
    try{
        const posts = await Post.find().sort({ createdAt: -1});
        res.json(posts);
    }catch(err){
        res.status(500).json({message: "Error fetching posts", error: err.message});
    }
});

// Posts by a specific user (for their profile page)
app.get("/api/users/:id/posts", async (req, res) => {
    try{
        const posts = await Post.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json(posts);
    }catch(err){
        res.status(500).json({message: "Error fetching user posts", error: err.message});
    }
});

//Local feed (user + friends)

//specific user
app.get("/api/users/:id/feed", async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const ids = [user.id, ...user.friends];
        const posts = await Post.find({ userId: {$in: ids}}).sort({ createdAt: -1});
        res.json(posts);
    }catch(err){
        res.status(500).json({message: "Error fetching posts", error: err.message});
    }
});

app.get("/api/posts/:id", async (req, res) => {
    try{
        const posts = await Post.findById(req.params.id);
        if(!posts){
            return res.status(404).json({message: "Post not found"});
        }
        res.json(posts);
    }catch (err){
        res.status(500).json({message: "Error fetching post", error: err.message});
    }
});

app.put("/api/posts/:id", async (req, res) => {
    try{
        const {description, hashtags} = req.body;
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {description, hashtags},
            {new: true}
        );
        res.json(post);
    } catch (err){
        res.status(500).json({message: "Error updating post", error: err.message});
    }
});

app.delete("/api/posts/:id", async (req, res) => {
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.json({message: "Post deleted"});
    }catch (err){
        res.status(500).json({message: "Error deleting post", error: err.message});
    }
});

app.post("/api/posts/:id/comments", async(req, res) => {
    try{
        const {userId, username, text} = req.body;
        const post = await  Post.findByIdAndUpdate(
            req.params.id,
            {$push: {comments: {userId, username, text}}},
            {new: true}
        );
        res.json(post);
    } catch (err){
        res.status(500).json({message: "Error adding comment", error: err.message});
    }
});

app.post("/api/posts/:id/report", async(req, res) => {
    try{
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {$inc: {reportCount: 1}},
            {new: true}
        );
        res.json(post);
    } catch (err){
        res.status(500).json({message: "Error reporting this post", error: err.message});
    }
});

//Albums 

app.post("/api/albums", async (req, res) => {
    try{
        const {userId, name, description, hashtags} = req.body;
        const album = new Album({userId, name, description, hashtags});
        await album.save();
        res.json(album);
    } catch (err){
        res.status(500).json({message: "Error creatiing album", error: err.message});
    }
});

//specific album
app.get("/api/users/:id/albums", async (req, res) => {
    try{
        const albums = await Album.find({ userId: req.params.id });
        res.json(albums);
    }catch(err){
        res.status(500).json({message: "Error fetching albums", error: err.message});
    }
});

app.get("/api/albums/:id", async (req, res) => {
    try{
        const album = await Album.findById(req.params.id).populate("posts");
        res.json(album);
    }catch (err){
        res.status(500).json({message: "Error fetching album", error: err.message});
    }
});

app.put("/api/albums/:id", async (req, res) => {
    try{
        const {name, description, hashtags} = req.body;
        const album = await Album.findByIdAndUpdate(
            req.params.id,
            {name, description, hashtags},
            {new: true}
        );
        res.json(album);
    } catch (err){
        res.status(500).json({message: "Error updating album", error: err.message});
    }
});

app.delete("/api/albums/:id", async (req, res) => {
    try{
        await Album.findByIdAndDelete(req.params.id);
        res.json({message: "Album deleted"});
    }catch (err){
        res.status(500).json({message: "Error deleting album", error: err.message});
    }
});

app.post("/api/albums/:id/posts", async(req, res) => {
    try{
        const {postId} = req.body;
        const album = await  Album.findByIdAndUpdate(
            req.params.id,
            {$addToSet: {posts: postId}},
            {new: true}
        );
        res.json(album);
    } catch (err){
        res.status(500).json({message: "Error adding post to album", error: err.message});
    }
});

app.delete("/api/albums/:id/posts/:postId", async(req, res) => {
    try{
        const album = await Album.findByIdAndUpdate(
            req.params.id,
            {$pull: {posts: req.params.postId}},
            {new: true}
        );
        res.json(album);
    } catch (err){
        res.status(500).json({message: "Error removing post from album.", error: err.message});
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
