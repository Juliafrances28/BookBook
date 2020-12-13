const express = require("express");
const orm = require("../config/orm.js");

const books = require("../models/books.js");
// const bcrypt = require('bcrypt');

const router = express.Router();

//This is required to do the google books backend stuff
const fetch = require("node-fetch");
const dotenv = require('dotenv');
dotenv.config();

const users = [];

require("dotenv").config();

const API_KEY = process.env.API_KEY;

// Import the model (cat.js) to use its database functions.
const bookbook = require("../models/books.js");

router.get("/", function (req, res) {
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

    } catch {
        console.log(err)

    }
    console.log(req.body)
    res.status(200).send("thanks");
    console.log(users)
    console.log(users.length)

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
router.get("/allbooks", function (req, res) {
    books.selectAll(function (data) {
        res.json({ books: data });
    });
});

//Presents all of the users - maybe this should be more secure?
router.get("/api/bookUser", function (req, res) {
    books.allUsers(function (data) {
        res.json({ books: data });
    });

});

//Looks for books based on genre and user input
router.get("/api/books/:genre", function (req, res) {
    let genre = req.params.genre;

    books.selectWhere("genre", genre, function (data) {
        res.json(data);
    })
});


router.get("/api/bookById/:id", function (req, res) {
    let id = req.params.id;
    books.selectWhere("id", id, function (data) {
        res.json(data);
    })
});

//User can mark a book as borrowed
router.put("/api/borrow/:bookId", function (req, res) {
    //change availability from true to false
    //change checkedout from false to true

    let condition = "id = " + req.params.bookId;

    books.updateOne({
        available: false
    }, condition, function (result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            changeSecondOne();
        }
    });

    function changeSecondOne() {
        books.updateOne({
            checkedOut: true
        }, condition, function (result) {
            if (result.changedRows == 0) {
                return res.status(404).end();
            } else {
                changeSecondOne();
                res.json({ id: req.params.id });
            }
        });
    }
});


router.put("/api/:bookId/return", function (req, res) {
    //change availability from false to true
    //change checkedout from true to false

    let condition = "id = " + req.params.bookId;

    books.updateOne({
        available: true
    }, condition, function (result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            changeSecondOne();
        }
    });

    function changeSecondOne() {
        books.updateOne({
            checkedOut: false
        }, condition, function (result) {
            if (result.changedRows == 0) {
                return res.status(404).end();
            } else {
                changeSecondOne();
                res.json({ id: req.params.id });
            }
        });
    }

});

//User can delete a book from their library
router.delete("/api/:bookId/delete", function (req, res) {
    let condition = "id = " + req.params.bookId;

    books.deleteOne(condition, function (result) {
        if (result.affectedRows == 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
});


//Google Books

//When the user gives a search entry, we return the JSON from google books - get request
router.get("/gbooks/:book", function (req, res) {
    //API_KEY will give the API key just to the server, but not to the client
    api_key = process.env.API_KEY;
    let bookSearch = req.params.book;
    let apiURL = "https://www.googleapis.com/books/v1/volumes?q=";
    apiURL += bookSearch;
    apiURL += "&printType=books&key="
    apiURL += api_key;

    fetch(apiURL).then(
        data => { return data.json() }
    ).then(
        res => { console.log(res) }
    );

});


// Export routes for server.js to use.
module.exports = router;