import { ObjectId } from "mongodb";
import { connectDB, getDB } from "./db.js";
import fs from "fs";

// every image already in backend/uploads becomes a possible post image
const IMAGES = fs.readdirSync("./uploads").filter(f => f.endsWith(".jpg") || f.endsWith(".png"));

// a date N days in the past, so the feed has a natural order
function daysAgo(n) {
    return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

 // finds the uploaded file whose name contains the keyword (e.g. "sunset" finds 1790926254775-sunset.jpg)
function pickImage(keyword) {
    const found = IMAGES.find(f => f.includes(keyword));
    return "/uploads/" + (found || IMAGES[0]);
}
async function seed() {
    await connectDB();
    const db = getDB();

    // 1. wipe, so running the script twice never creates duplicates
    await db.collection("users").deleteMany({});
    await db.collection("posts").deleteMany({});
    await db.collection("albums").deleteMany({});
    await db.collection("reasons").deleteMany({});

    // 2. make every id up front, so documents can point at each other before they are inserted
    const u = [];   // user ids
    for (let i = 0; i < 8; i++) { u.push(new ObjectId()); }
    const p = [];   // post ids
    for (let i = 0; i < 13; i++) { p.push(new ObjectId()); }

    // 3. users (plain-text passwords, as the spec requires)
    const users = [
        { _id: u[0], username: "amara.lens", email: "test@test.com", password: "test1234", bio: "Film photographer chasing golden hour" },
        { _id: u[1], username: "muse.admin", email: "admin@muse.com", password: "admin1234", bio: "Keeping the gallery lovely", isAdmin: true },
        { _id: u[2], username: "thandi.paints", email: "thandi@muse.com", password: "password123", bio: "Oil pastels and Sunday markets" },
        { _id: u[3], username: "kgosi.keys", email: "kgosi@muse.com", password: "password123", bio: "Piano, lo-fi and long walks" },
        { _id: u[4], username: "lwazi.lens", email: "lwazi@muse.com", password: "password123", bio: "Street photography, Joburg" },
        { _id: u[5], username: "naledi.sketches", email: "naledi@muse.com", password: "password123", bio: "Doodles on every receipt" },
        { _id: u[6], username: "sipho.beats", email: "sipho@muse.com", password: "password123", bio: "Beatmaker, marimba on weekends" },
        { _id: u[7], username: "zanele.film", email: "zanele@muse.com", password: "password123", bio: "Analogue film and slow mornings" },
    ];

    // defaults every user needs (there is no schema any more)
    for (let i = 0; i < users.length; i++) {
        users[i].avatarUrl = "";
        users[i].friends = [];
        users[i].friendRequests = [];
        if (users[i].isAdmin !== true) { users[i].isAdmin = false; }
    }

    // 4. friendships, added to BOTH users so they stay in sync
    const pairs = [[0, 2], [0, 3], [2, 3], [3, 4], [4, 6], [5, 7]];
    for (let i = 0; i < pairs.length; i++) {
        const a = pairs[i][0];
        const b = pairs[i][1];
        users[a].friends.push(u[b]);
        users[b].friends.push(u[a]);
    }
    // pending request: user 5 asked user 0 (stored on the receiver), so test@test.com can demo "accept"
    users[0].friendRequests.push(u[5]);

    await db.collection("users").insertMany(users);

    // 5. posts: [author index, caption, hashtags (no #), days ago, image keyword]
    const postData = [
        [0, "Last light over the pier", ["goldenhour", "sunset"], 1, "sunset"],
        [2, "Baroque ceilings never get old", ["art", "baroque"], 2, "art1"],
        [2, "Sketchbook study of a painted ceiling", ["sketch", "drawing"], 3, "art1"],
        [3, "Driving home with the lo-fi on", ["music", "lofi"], 4, "avatar2"],
        [4, "Vintage lines, no filter", ["vintage", "monochrome"], 5, "art2"],
        [4, "Parked up at dusk, Joburg", ["joburg", "street"], 6, "avatar2"],
        [7, "First roll of the year, a vintage cockpit", ["film", "analogue"], 7, "art2"],
        [5, "Gerbera in soft light", ["flowers", "floral"], 8, "flowers"],
        [6, "Marimba practice by the water, take three", ["music", "marimba"], 9, "sunset"],
        [0, "Market-day colours", ["flowers", "colour"], 10, "flowers"],
        [5, "Figure study after a ceiling painting", ["portrait", "art"], 11, "art1"],
        [0, "Another evening, another sunset", ["goldenhour", "sunset"], 12, "sunset"],
        [7, "Slow mornings, slow film", ["film", "analogue"], 13, "art2"],
    ];

    const posts = [];
    for (let i = 0; i < postData.length; i++) {
        const author = postData[i][0];
        posts.push({
            _id: p[i],
            userId: u[author],
            username: users[author].username,
            imageUrl: pickImage(postData[i][4]),
            description: postData[i][1],
            hashtags: postData[i][2],
            comments: [],
            reportCount: 0,
            createdAt: daysAgo(postData[i][3]),
        });
    }

    // post 1 gets 6 comments (for the "many comments" row)
    const commentData = [
        [0, "This colour palette is unreal"],
        [3, "Where was this taken?"],
        [4, "Saving this for inspo"],
        [5, "The light here!!"],
        [6, "Need a print of this"],
        [7, "Okay I'm obsessed"],
    ];
    for (let i = 0; i < commentData.length; i++) {
        const who = commentData[i][0];
        posts[1].comments.push({
            _id: new ObjectId(),
            userId: u[who],
            username: users[who].username,
            text: commentData[i][1],
            createdAt: daysAgo(1),
        });
    }

    // post 10 has 3 reports (hidden in the feed), post 4 has 1 (still visible)
    // reports keep WHO reported and WHY, which the admin page shows
    posts[10].reportCount = 3;
    posts[10].reports = [
        { userId: u[3], reason: "Spam", createdAt: daysAgo(2) },
        { userId: u[4], reason: "Inappropriate content", createdAt: daysAgo(2) },
        { userId: u[6], reason: "Spam", createdAt: daysAgo(1) },
    ];
    
    posts[4].reportCount = 1;
    posts[4].reports = [{ userId: u[2], reason: "Other", createdAt: daysAgo(1) }];

    await db.collection("posts").insertMany(posts);

    // 6. albums: [owner index, name, description, hashtags, post indexes (the owner's own posts)]
    const albumData = [
        [0, "Golden Hours", "Every sunset I couldn't resist", ["goldenhour"], [0, 11]],
        [2, "Sketchbook Pages", "Pastels, pencils and happy accidents", ["sketch", "art"], [1, 2]],
        [4, "Joburg Streets", "The city, one frame at a time", ["street", "joburg"], [4, 5]],
        [7, "Analogue Days", "Film grain and slow mornings", ["film"], [6, 12]],
        [3, "Soundtracks", "Music made in the studio", ["music"], [3]],
    ];

    const albums = [];
    for (let i = 0; i < albumData.length; i++) {
        const postIds = [];
        for (let j = 0; j < albumData[i][4].length; j++) {
            postIds.push(p[albumData[i][4][j]]);
        }
        albums.push({
            userId: u[albumData[i][0]],
            name: albumData[i][1],
            description: albumData[i][2],
            hashtags: albumData[i][3],
            posts: postIds,
            createdAt: daysAgo(5),
        });
    }
    await db.collection("albums").insertMany(albums);

    // 7. predefined reasons for reporting a post (the report feature will use these)
    await db.collection("reasons").insertMany([
        { reason: "Spam" },
        { reason: "Inappropriate content" },
        { reason: "Harassment" },
        { reason: "Copyright" },
        { reason: "Other" },
    ]);

    console.log("Seeded:", users.length, "users,", posts.length, "posts,", albums.length, "albums");
    process.exit(0);   // db.js keeps the connection open, so we end the script ourselves
}

seed();