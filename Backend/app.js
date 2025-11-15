const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressLayouts = require('express-ejs-layouts');
const Posts = require("./models/post");
const ejsMate = require("ejs-mate");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Frontend/views/ejs"));
app.use(express.static(path.join(__dirname,"../Frontend/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


app.use(expressLayouts);
app.set('layout', path.join(__dirname, '../Frontend/views/layouts/boilerplate'));

main().
then(()=>{
    console.log("connection succesful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/unsaid');
}

//view All
app.get("/unsaid/viewAll",async (req,res)=>{
    let allPosts = await Posts.find({});
    res.render("index", { showLayout: true , allPosts});
})

//create new
app.get("/unsaid/create",(req,res)=>{
    res.render("create",{ showLayout: true });
})

app.post("/unsaid/create",(req,res)=>{
    try{
        let {username, content} = req.body;
        let newPost = new Posts({
            username: username,
            content: content,
        });
    newPost.save().then((res)=>{
        console.log("Post Added");
    })
        .catch((err)=>{
            console.log("error");
        })
    res.redirect("/unsaid/viewAll");
    }
    catch(err){
        console.log(err);
    }
})

//view specific username
app.get("/unsaid/user/:username", async (req, res)=>{
    let {username} = req.params;
    let Post= await Posts.find({username: username});
    console.log(Post);
    if(Post.length === 0){
        return res.render("empty" ,{ showLayout: true });
    }
    res.render("view", {showLayout: true, Post});
})

//delete post
app.delete("/unsaid/:id/delete", async (req, res) => {
    let { id } = req.params;
    let deletedPost = await Posts.findByIdAndDelete(id);

    if (!deletedPost) {
        return res.status(404).send("Post not found");
    }

    res.redirect(`/unsaid/user/${deletedPost.username}`);
});


//edit post
app.get("/unsaid/post/:id",  async (req, res)=>{
    let {id} = req.params;
    let post = await Posts.findById(id);
    res.render("edit", {showLayout: true, post});
})

app.put("/unsaid/:id", async(req,res)=>{
    let {id} = req.params;
    let {content : newContent} = req.body;
    let post = await Posts.findByIdAndUpdate(id,
         {
            content : newContent,
            edited : true, 
            editedAt : Date.now()
        }, {new : true} );
    console.log(post);
    res.redirect(`/unsaid/user/${post.username}`);
})

app.get("/unsaid/login", (req, res)=>{
    res.render("login",{ showLayout: false });
})

app.get("/unsaid/signUp", (req, res)=>{
    res.render("signUp",{ showLayout: false });
})

const port = 2415;

app.listen(port, ()=>{
    console.log(`${port} working`);
})