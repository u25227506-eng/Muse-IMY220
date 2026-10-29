import fs from "fs";
import { connectDB, getDB } from "./db.js";

// writes every collection to a JSON file in the project's /database folder
async function exportDb() {
    await connectDB();
    const db = getDB();

    fs.mkdirSync("../database", { recursive: true });   // creates the folder if it is not there yet

    const names = ["users", "posts", "albums", "reasons"];
    for (let i = 0; i < names.length; i++) {
        const docs = await db.collection(names[i]).find().toArray();
        fs.writeFileSync(`../database/${names[i]}.json`, JSON.stringify(docs, null, 2));   // null, 2 = readable indentation
        console.log("Exported", docs.length, "documents to database/" + names[i] + ".json");
    }
    process.exit(0);   // db.js keeps the connection open, so we end the script ourselves
}

exportDb();