const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SECRET for JWT
const JWT_SECRET = "unsaid_secret_key"; // you can change later

// Signup 
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPass
        });

        await user.save();

        // Redirect after successful signup
        res.redirect("/unsaid/viewAll");

    } catch (err) {
        res.send("Signup Error: " + err.message);
    }
});


// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    // user not found → go to signup page with message
    if (!user) {
        return res.redirect("/unsaid/signUp?msg=User not found. Please create an account!");
    }

    // check password
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
        return res.redirect("/unsaid/login?msg=Wrong password!");
    }

    // create token (optional)
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    // save user in session
    req.session.user = { username: user.username, id: user._id };

    // redirect on success
    return res.redirect("/unsaid/viewAll");
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/unsaid/login");
    });
});


module.exports = router;
