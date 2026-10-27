import mongoose from "mongoose";
import connectDB from "./db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Album from "./models/Album.js";

async function seed(){
    await connect();
    
    //1. wipe

    //2. users

    const users = await User.insertMany([

    ])
    //3. friends

    //4. posts

    const posts = await Post.insertMany([

    ]);

    //5. albums
    await Album.insertMany([

    ]);

    console.log("Seeded");
    await mongoose.disconnect();


}