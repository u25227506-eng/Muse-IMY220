import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : { type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    bio: {type: String, default: ""},
    avatarUrl: {type: String, default: ""},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    friendRequests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
}); 

export default mongoose.model("User", userSchema);
