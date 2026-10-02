import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    username : String, 
    text: String, 
    createdAt: {type: Date, default: Date.now},
}); 

const postSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    username : String,
    imageUrl: {type: String, required: true},
    description: {type: String, required: true},
    hashtags: [String],
    comments: [commentSchema],
    reportCount: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model("Post", postSchema);
