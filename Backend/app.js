require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressLayouts = require('express-ejs-layouts');
const Posts = require("./models/post");
const ejsMate = require("ejs-mate");
const authRoutes = require("./routes/auth");
const session = require("express-session");

app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Frontend/views/ejs"));

app.use(express.static(path.join(__dirname,"../Frontend/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.showLayout = true; 
    next();
});


app.use(expressLayouts);
app.set('layout', path.join(__dirname, '../Frontend/views/layouts/boilerplate'));

app.use("/api/auth", authRoutes);

main().
then(()=>{
    console.log("connection succesful");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

//view All
app.get("/unsaid/viewAll",async (req,res)=>{
    let allPosts = await Posts.find({}).sort({ createdAt: -1 });

    res.render("index", {allPosts});
})

//create new
app.get("/unsaid/create",isLoggedIn, (req,res)=>{
    res.render("create");
})

app.post("/unsaid/create", isLoggedIn, async (req,res)=>{
    try{
        let username = req.session.user.username;
        let {content } = req.body;

        let newPost = new Posts({
            username,
            content
        });

        await newPost.save();
        console.log("Post Added");

        res.redirect("/unsaid/viewAll");
    }
    catch(err){
        console.log(err);
    }
});


//delete post
app.delete("/unsaid/:id/delete", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    let deletedPost = await Posts.findByIdAndDelete(id);

    if (!deletedPost) {
        return res.status(404).send("Post not found");
    }

    res.redirect(`/unsaid/myPosts`);
});


//edit post
app.get("/unsaid/post/:id",isLoggedIn, async (req, res)=>{
    let {id} = req.params;
    let post = await Posts.findById(id);
    res.render("edit", {post});
})

app.put("/unsaid/:id",isLoggedIn, async(req,res)=>{
    let {id} = req.params;
    let {content : newContent} = req.body;
    let post = await Posts.findByIdAndUpdate(id,
         {
            content : newContent,
            edited : true, 
            editedAt : Date.now()
        }, {new : true} );
    res.redirect(`/unsaid/myPosts`);
})

app.get("/unsaid/login", (req, res)=>{
    res.locals.showLayout = false;
    res.render("login", { msg: req.query.msg });
})

app.get("/unsaid/signUp", (req, res)=>{
    res.locals.showLayout = false;
    res.render("signUp", { msg: req.query.msg });
})


function isLoggedIn(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/unsaid/login");
    }
    next();
}

app.get("/unsaid/myPosts", isLoggedIn, async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/unsaid/login");
    }

    const username = req.session.user.username;
    const posts = await Posts.find({ username }).sort({ createdAt: -1 });

    if (posts.length === 0) {
        return res.render("empty");
    }

    res.render("view", { posts });
});


const port = process.env.PORT || 2415;

app.get("/", (req, res) => {
    res.redirect("/unsaid/viewAll");
});

app.listen(port, ()=>console.log(`Server running on port ${port}`));
