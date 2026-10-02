import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    name : {type: String, required: true}, 
    description: {type: String, required: true},
    hashtags: [String],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    createdAt: {type: Date, default: Date.now},
}); 

export default mongoose.model("Album", albumSchema);
