const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    isPublic : {
        type: Boolean,
        default: true
    },
    likes: {
        type: Number,
        default: 0 
    },
    comments: [{ 
        type: String 
    }],
    createdAt: {
        type: Date,
        default: Date.now 
    },
    edited: {
        type: Boolean,
        default: false
    },
    editedAt: { 
        type: Date
    },
    img: {
        type: String
    }
})

const Post = mongoose.model("Post",postSchema);

module.exports = Post;