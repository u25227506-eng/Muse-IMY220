import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// Student Number: u25227506

let client;
let db;

async function connectDB() {
    const uri = process.env.MONGO_URI;

    client = new MongoClient(uri);

    await client.connect();

    db = client.db("muse");
    console.log("Connected to MongoDB");
}

function getDB() {
    return db;
}

export { connectDB, getDB };