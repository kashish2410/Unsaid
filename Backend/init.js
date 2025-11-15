const mongoose = require("mongoose");
const Post = require("./models/post.js")

main().then(() => {
    console.log("connection successful");
    initDB();
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/unsaid');
}

const allPosts = [
    {
        username : "kashish24",
        content : "hello, this is my first post on this website. I hope this website does great",
    },
    {
        username : "komal09",
        content : "All the best Kashish for this amazing website. This website is doing great",
    },
    {
        username : "bhoomi23",
        content : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, neque voluptatibus ex rem laborum vero voluptates doloribus officiis ea, error optio! Sed nesciunt officia mollitia quos tempore rem corrupti dolor",
    },
    {
        username : "komal09",
        content : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, neque voluptatibus ex rem laborum vero voluptates doloribus officiis ea, error optio! Sed nesciunt officia mollitia quos tempore rem corrupti dolor.",
    }
];

async function initDB() {
    await Post.deleteMany({});
    await Post.insertMany(allPosts);
    console.log("All Posts added ");
}
