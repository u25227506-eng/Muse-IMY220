import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {connectDB, getDB} from "./db.js";
import {ObjectId} from "mongodb"

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
//for trimming to help search and hashtags
function cleanHashtags(list) {
    return list.map(h => h.trim().replace(/^#/, "")).filter(h => h !== "");
}

// true only if this user id belongs to an admin account
async function isAdmin(db, userId) {
    if (!userId || !ObjectId.isValid(userId)) return false;
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    return user !== null && user.isAdmin === true;
}

//signing in/up

app.post("/api/signin", async (req, res) => {
    try{
        const db = getDB();
        const {email, password} = req.body;
        const user = await db.collection("users").findOne({email, password});
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
        const db = getDB();
        const {username, email, password} = req.body;
        const existing = await db.collection("users").findOne({email});
        if (existing){
            return res.status(400).json({message: "Email already in use"});
        }
        const newUser = {
            username, email, password, 
            bio: "",
            avatarUrl: "",
            friends: [],
            friendRequests: [],
            isAdmin: false,
        };

        const result = await db.collection("users").insertOne(newUser);

        res.json({message: "Sign up successful", user: {...newUser, _id: result.insertedId}});
    } catch(err){
        res.status(500).json({message: "Signup error", error: err.message});
    }
});

//Users/Profile

app.get("/api/users/:id", async (req, res) => {
    try{
        const db = getDB();

        const user = await db.collection("users").findOne(
            {_id: new ObjectId(req.params.id)},
            { projection: {password: 0, email: 0}}
        );

        if(!user){
            return res.status(404).json({message: "User not found"});
        } 

        const friends = await db.collection("users").find(
            {_id:{ $in: user.friends}},
            {projection: {username: 1, avatarUrl: 1}}
        ).toArray();

        const friendRequests = await db.collection("users").find(
            {_id:{ $in: user.friendRequests}},
            {projection: {username: 1, avatarUrl: 1}}
        ).toArray();

        res.json({...user, friends, friendRequests});
    } catch (err){
         res.status(500).json({message: "Error fetching user", error: err.message});
    }
});

app.put("/api/users/:id", async (req, res) => {
    try {
        const db = getDB();
        const { username, bio } = req.body;
        const user = await db.collection("users").findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { username, bio } },                    
            { returnDocument: "after", projection: { password: 0 } }  
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
});

//friends
app.post("/api/users/:id/friend-request", async (req, res) => {
    try {
        const db = getDB();
        const { fromUserId } = req.body;
        await db.collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $addToSet: { friendRequests: new ObjectId(fromUserId) } }   // no duplicate if they click twice
        );
        res.json({ message: "Friend request sent" });
    } catch (err) {
        res.status(500).json({ message: "Error sending friend request", error: err.message });
    }
});

app.post("/api/users/:id/accept-friend", async (req, res) => {
    try {
        const db = getDB();
        const me = new ObjectId(req.params.id);
        const friend = new ObjectId(req.body.friendId);
       //my side: add and remove
        await db.collection("users").updateOne(
            { _id: me },
            { $addToSet: { friends: friend }, $pull: { friendRequests: friend } }
        );
        //their side
        await db.collection("users").updateOne(
            { _id: friend },
            { $addToSet: { friends: me } }
        );
        res.json({ message: "Friend request accepted" });
    } catch (err) {
        res.status(500).json({ message: "Error accepting friend request", error: err.message });
    }
});

app.delete("/api/users/:id/unfriend/:friendId", async (req, res) => {
    try {
        const db = getDB();
        const me = new ObjectId(req.params.id);
        const friend = new ObjectId(req.params.friendId);
        await db.collection("users").updateOne({ _id: me }, { $pull: { friends: friend } });
        await db.collection("users").updateOne({ _id: friend }, { $pull: { friends: me } });
        res.json({ message: "Unfriended" });
    } catch (err) {
        res.status(500).json({ message: "Error unfriending", error: err.message });
    }
});

//Posts
app.post("/api/posts", upload.single("image"), async (req, res) => {
    try {
        const db = getDB();
        const { userId, username, description, hashtags } = req.body;
        const newPost = {
            userId: new ObjectId(userId), //stored as ObjectId so the feed queries match
            username,
            imageUrl: `/uploads/${req.file.filename}`,
            description,
            hashtags: cleanHashtags(hashtags ? hashtags.split(",") : []),
            comments: [],
            reportCount: 0,
            createdAt: new Date(),                           
        };
        const result = await db.collection("posts").insertOne(newPost);
        res.json({ ...newPost, _id: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: "Error creating post", error: err.message });
    }
});

//Global feed
app.get("/api/posts", async (req, res) => {
    try {
        const db = getDB();
        const posts = await db.collection("posts").find().sort({ createdAt: -1 }).toArray();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching posts", error: err.message });
    }
});

app.get("/api/posts/:id", async (req, res) => {
    try {
        const db = getDB();
        const post = await db.collection("posts").findOne({ _id: new ObjectId(req.params.id) });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Error fetching post", error: err.message });
    }
});

app.put("/api/posts/:id", async (req, res) => {
    try {
        const db = getDB();
        const { description, hashtags } = req.body;
        const post = await db.collection("posts").findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { description, hashtags: cleanHashtags(hashtags || []) } },
            { returnDocument: "after" }
        );
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Error updating post", error: err.message });
    }
});

app.delete("/api/posts/:id", async (req, res) => {
    try {
        const db = getDB();
        const postId = new ObjectId(req.params.id);
        await db.collection("posts").deleteOne({ _id: postId });  

        const albums = await db.collection("albums").find({ posts: postId }).toArray();
        for (let i = 0; i < albums.length; i++) {
            if (albums[i].posts.length === 1) {
                //album goes too 
                await db.collection("albums").deleteOne({ _id: albums[i]._id });
            } else {
                await db.collection("albums").updateOne({ _id: albums[i]._id }, { $pull: { posts: postId } });
            }
        }
        res.json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting post", error: err.message });
    }
});

app.post("/api/posts/:id/comments", async (req, res) => {
    try {
        const db = getDB();
        const { userId, username, text } = req.body;
        const comment = {
            _id: new ObjectId(),                               
            userId: new ObjectId(userId),
            username,
            text,
            createdAt: new Date(),
        };
        const post = await db.collection("posts").findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $push: { comments: comment } },
            { returnDocument: "after" }
        );
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Error adding comment", error: err.message });
    }
});

// the predefined reasons a user can choose from (admins will add to this list later)
app.get("/api/reasons", async (req, res) => {
    try {
        const db = getDB();
        const reasons = await db.collection("reasons").find().toArray();
        res.json(reasons);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reasons", error: err.message });
    }
});

// search users, posts and albums with one search term
app.get("/api/search", async (req, res) => {
    try {
        const db = getDB();
        const q = (req.query.q || "").trim().replace(/^#/, "");   // "#film" and "film" search the same thing
        if (q === "") {
            return res.json({ users: [], posts: [], albums: [] });
        }

        // escape characters that mean something in a regular expression, so the term is searched literally
        const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // $regex with no anchors matches PARTIAL words; "i" ignores upper/lower case
        const match = { $regex: safe, $options: "i" };

        // users: by username or email; only the username and picture are sent back (no email or password)
        const users = await db.collection("users")
            .find({ $or: [{ username: match }, { email: match }] }, { projection: { username: 1, avatarUrl: 1 } })
            .toArray();

        // posts: by description or hashtag, newest first
        const posts = await db.collection("posts")
            .find({ $or: [{ description: match }, { hashtags: match }] })
            .sort({ createdAt: -1 })
            .toArray();

        // albums: by name, description or hashtag
        const albums = await db.collection("albums")
            .find({ $or: [{ name: match }, { description: match }, { hashtags: match }] })
            .toArray();

        res.json({ users, posts, albums });
    } catch (err) {
        res.status(500).json({ message: "Error searching", error: err.message });
    }
});

// which albums a post belongs to (shown on the post page)
app.get("/api/posts/:id/albums", async (req, res) => {
    try {
        const db = getDB();
        const albums = await db.collection("albums")
            .find({ posts: new ObjectId(req.params.id) }, { projection: { name: 1 } })   // matching an array field: true if the id is anywhere in the list
            .toArray();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ message: "Error fetching albums for post", error: err.message });
    }
});


// replace your old /api/posts/:id/report route with this one
app.post("/api/posts/:id/report", async (req, res) => {
    try {
        const db = getDB();
        const postId = new ObjectId(req.params.id);
        const userId = new ObjectId(req.body.userId);

        const post = await db.collection("posts").findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.userId.equals(userId)) {                       // the spec says you can't report your own post
            return res.status(400).json({ message: "You cannot report your own post" });
        }
        const alreadyReported = (post.reports || []).some(r => r.userId.equals(userId));
        if (alreadyReported) {                                  // one report per person, so nobody can hide a post alone
            return res.status(400).json({ message: "You have already reported this post" });
        }

        const updated = await db.collection("posts").findOneAndUpdate(
            { _id: postId },
            {
                $push: { reports: { userId, reason: req.body.reason, createdAt: new Date() } },   // keeps WHO and WHY, for the admin list
                $inc: { reportCount: 1 }                                                          // the number the feed checks
            },
            { returnDocument: "after" }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error reporting this post", error: err.message });
    }
});

// posts by one user (profile page)
app.get("/api/users/:id/posts", async (req, res) => {
    try {
        const db = getDB();
        const posts = await db.collection("posts")
            .find({ userId: new ObjectId(req.params.id) })   // ids are stored as ObjectId, so convert the URL text
            .sort({ createdAt: -1 })                         // newest first
            .toArray();                                      // find() gives a cursor, toArray() makes a list
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user posts", error: err.message });
    }
});

// local feed: my posts plus my friends' posts
app.get("/api/users/:id/feed", async (req, res) => {
    try {
        const db = getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const ids = [user._id, ...user.friends];             // the native driver has no user.id shortcut
        const posts = await db.collection("posts")
            .find({ userId: { $in: ids } })                  // $in: match any id in the list
            .sort({ createdAt: -1 })
            .toArray();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching feed", error: err.message });
    }
});

// albums by one user (profile page)
app.get("/api/users/:id/albums", async (req, res) => {
    try {
        const db = getDB();
        const albums = await db.collection("albums")
            .find({ userId: new ObjectId(req.params.id) })
            .toArray();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ message: "Error fetching albums", error: err.message });
    }
});

//Albums

app.post("/api/albums", async (req, res) => {
    try {
        const db = getDB();
        const { userId, name, description, hashtags } = req.body;
        const newAlbum = {
            userId: new ObjectId(userId),
            name,
            description,
            hashtags: cleanHashtags(hashtags || []),
            posts: [],
            createdAt: new Date(),
        };
        const result = await db.collection("albums").insertOne(newAlbum);
        res.json({ ...newAlbum, _id: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: "Error creating album", error: err.message });
    }
});

app.get("/api/albums/:id", async (req, res) => {
    try {
        const db = getDB();
        const album = await db.collection("albums").findOne({ _id: new ObjectId(req.params.id) });
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        // replaces Mongoose's populate: fetch the full posts for the stored ids
        const posts = await db.collection("posts").find({ _id: { $in: album.posts } }).toArray();
        res.json({ ...album, posts });
    } catch (err) {
        res.status(500).json({ message: "Error fetching album", error: err.message });
    }
});

app.put("/api/albums/:id", async (req, res) => {
    try {
        const db = getDB();
        const { name, description, hashtags } = req.body;
        const album = await db.collection("albums").findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { name, description, hashtags: cleanHashtags(hashtags || []) } },
            { returnDocument: "after" }
        );
        res.json(album);
    } catch (err) {
        res.status(500).json({ message: "Error updating album", error: err.message });
    }
});

app.delete("/api/albums/:id", async (req, res) => {
    try {
        const db = getDB();
        await db.collection("albums").deleteOne({ _id: new ObjectId(req.params.id) });   //posts stay, only the album goes
        res.json({ message: "Album deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting album", error: err.message });
    }
});

app.post("/api/albums/:id/posts", async (req, res) => {
    try {
        const db = getDB();
        const album = await db.collection("albums").findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $addToSet: { posts: new ObjectId(req.body.postId) } },   //no duplicates
            { returnDocument: "after" }
        );
        res.json(album);
    } catch (err) {
        res.status(500).json({ message: "Error adding post to album", error: err.message });
    }
});

app.delete("/api/albums/:id/posts/:postId", async (req, res) => {
    try {
        const db = getDB();
        const album = await db.collection("albums").findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $pull: { posts: new ObjectId(req.params.postId) } }, // remove it from the list
            { returnDocument: "after" }
        );
        res.json(album);
    } catch (err) {
        res.status(500).json({ message: "Error removing post from album", error: err.message });
    }
});

// ===== ADMIN =====

// all reported posts, most reported first (admin only)
app.get("/api/admin/reported", async (req, res) => {
    try {
        const db = getDB();
        if (!(await isAdmin(db, req.query.adminId))) {
            return res.status(403).json({ message: "Admins only" });
        }
        const posts = await db.collection("posts")
            .find({ reportCount: { $gt: 0 } })      // $gt: greater than 0, so only posts that have reports
            .sort({ reportCount: -1 })
            .toArray();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reported posts", error: err.message });
    }
});

// the admin decides a post is fine: remove all its reports
app.post("/api/admin/posts/:id/dismiss-reports", async (req, res) => {
    try {
        const db = getDB();
        if (!(await isAdmin(db, req.body.adminId))) {
            return res.status(403).json({ message: "Admins only" });
        }
        await db.collection("posts").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { reportCount: 0, reports: [] } }
        );
        res.json({ message: "Reports removed" });
    } catch (err) {
        res.status(500).json({ message: "Error removing reports", error: err.message });
    }
});

// add a new report reason (admin only)
app.post("/api/reasons", async (req, res) => {
    try {
        const db = getDB();
        if (!(await isAdmin(db, req.body.adminId))) {
            return res.status(403).json({ message: "Admins only" });
        }
        const reason = (req.body.reason || "").trim();
        if (reason === "") {
            return res.status(400).json({ message: "Please type a reason" });
        }
        const existing = await db.collection("reasons").findOne({ reason });
        if (existing) {
            return res.status(400).json({ message: "That reason already exists" });
        }
        const result = await db.collection("reasons").insertOne({ reason });
        res.json({ _id: result.insertedId, reason });
    } catch (err) {
        res.status(500).json({ message: "Error adding reason", error: err.message });
    }
});

// list every user (admin only; no emails or passwords)
app.get("/api/users", async (req, res) => {
    try {
        const db = getDB();
        if (!(await isAdmin(db, req.query.adminId))) {
            return res.status(403).json({ message: "Admins only" });
        }
        const users = await db.collection("users")
            .find({}, { projection: { username: 1, avatarUrl: 1, isAdmin: 1 } })
            .sort({ username: 1 })
            .toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
});

// delete a user account and everything that belongs to it (admin only)
app.delete("/api/admin/users/:id", async (req, res) => {
    try {
        const db = getDB();
        if (!(await isAdmin(db, req.query.adminId))) {
            return res.status(403).json({ message: "Admins only" });
        }
        const target = new ObjectId(req.params.id);
        if (target.equals(new ObjectId(req.query.adminId))) {
            return res.status(400).json({ message: "You cannot delete your own admin account" });
        }

        // their posts: remember the ids so other people's albums can drop them
        const theirPosts = await db.collection("posts").find({ userId: target }, { projection: { _id: 1 } }).toArray();
        const postIds = theirPosts.map(p => p._id);

        await db.collection("posts").deleteMany({ userId: target });
        await db.collection("albums").deleteMany({ userId: target });
        await db.collection("albums").updateMany({}, { $pull: { posts: { $in: postIds } } });                    // others' albums lose those posts
        await db.collection("users").updateMany({}, { $pull: { friends: target, friendRequests: target } });    // gone from every friends list
        await db.collection("posts").updateMany({}, { $pull: { comments: { userId: target } } });               // their comments disappear
        await db.collection("users").deleteOne({ _id: target });

        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
});

// change a profile picture; multer saves the file exactly like a post image
app.put("/api/users/:id/avatar", upload.single("avatar"), async (req, res) => {
    try {
        const db = getDB();
        if (!req.file) {
            return res.status(400).json({ message: "Please choose a picture" });
        }
        const avatarUrl = `/uploads/${req.file.filename}`;
        await db.collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { avatarUrl } }
        );
        res.json({ avatarUrl });
    } catch (err) {
        res.status(500).json({ message: "Error changing picture", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
