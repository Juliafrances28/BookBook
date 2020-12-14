const express = require("express");
const bcrypt = require('bcrypt');
const isUser = require("../config/middleware/isUser")


const router = express.Router();

const users = []

// Import the model (cat.js) to use its database functions.
const bookbook = require("../models/books.js");

router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
//serve up home page if the user logs in
router.get("/home", isUser ,function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
//ascynhronous library bcrypt needed.  Need async, await, try and catch
router.post("/api/bookUser", async function (req, res) {
    try {
        //part of the 2 arguments needed to create hashed password ** I can use a number only if needed and delete the salt variable.  Default is 10
        const salt = await bcrypt.genSalt();
        //takes user password and scrambles it
        const scrambled = await bcrypt.hash(req.body.password, salt)
        console.log(scrambled)
        //sending up to array.  ***Need to figure out how to send to database**
        let user = {
            email: req.body.email,
            password: scrambled
        };
        users.push(user)

    } catch{
        console.log(err)

    }
    console.log(req.body)
    res.status(200).send("thanks");
    console.log(users)
    console.log(users.length)

});

router.get("/api/bookUser", function (req, res) {
    res.json(users)

});

router.post("/api/bookUser/check", async function (req, res) {
    const user = users.find(user => user.email = req.body.email)
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send("Congratulations")
        } else {
            res.send("Not the same Password")
        }

    } catch {
        console.log("did not work")
    }

});

//Server side API calls go here

const gbooksAPIkey = "AIzaSyBbP25k0xQFGGCWKgeCDngvaUC3_ufLXNs";
// Export routes for server.js to use.
module.exports = router;