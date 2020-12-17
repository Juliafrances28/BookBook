const express = require("express");
const path = require('path');
const bcrypt = require('bcrypt');
const isUser = require("../config/middleware/isUser")
const isNotUser = require("../config/middleware/isNotUser")

const orm = require("../config/orm.js");

const books = require("../models/books.js");
// const bcrypt = require('bcrypt');


const router = express.Router();


//This is required to do the google books backend stuff
const fetch = require("node-fetch");
const dotenv = require('dotenv');
//require("dotenv").config();
dotenv.config();

const API_KEY = process.env.API_KEY;


// Import the model (cat.js) to use its database functions.
const bookbook = require("../models/books.js");
const e = require("express");
const passport = require("../config/passport");

router.get("/", isNotUser, function (req, res) {
    console.log("Sent to home because no user was found")
    //we should not have req.user since they did not pass authentication and were redirected here 
    // console.log(req)
    res.sendFile(path.join(__dirname, "../index.html"), { message: req.flash("test") });

});

//serve up home page if the user logs in
// router.get("/home", isUser, function (req, res) {
//     res.sendFile(path.join(__dirname, "public/index.html"));
// });

//ascynhronous library bcrypt needed.  Need async, await, try and catch
router.post("/", async function (req, res) {
    try {
        //part of the 2 arguments needed to create hashed password ** I can use a number only if needed and delete the salt variable.  Default is 10
        const salt = await bcrypt.genSalt();
        //takes user password and scrambles it
        const scrambled = await bcrypt.hash(req.body.password, salt)
        console.log(scrambled)
        //sending up to array.  ***Need to figure out how to send to database**
        books.createUser(["name", "email", "secret"], [req.body.name, req.body.email, scrambled], function (result) {
        
        })



    } catch (error) {
        if (error)
            throw error;

    }

    console.log(req, "line52")
    res.redirect("/login");


})

router.get("/login", isNotUser, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
    // console.log(req.session.passport)
    console.log(req.user, "line72 controller")
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/home",
    failureFlash: true,
    message: "test"
}), function (req, res) {
    //  res.json(req.user)
    // res.send(req.user)

})



router.get("/home", isUser, function (req, res) {
    //after authenticate that happends in the post login route, the redirect to /home makes req.user available
    res.sendFile(path.join(__dirname, "../public/html/homepage.html"));
    console.log("Made it to home page!")
})

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
    books.selectWhere("gbookId", id, function (data) {
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
    let bookSearch = req.params.book;
    let apiURL = "https://www.googleapis.com/books/v1/volumes?q=";
    apiURL += bookSearch;
    apiURL += "&printType=books&key="
    apiURL += API_KEY;

    fetch(apiURL).then(function (result) {
        return result.json();
    }).then(function (response) {
        res.json(response);
    });

});

//When "add to library" is clicked, we need to send the backend title, author, genre, gbooksId
router.post("/library/new/", function (req, res) {
    books.insertOne([
        //STILL NEED TO FIGURE OUT THE USER ID SITUATION
        "title", "author", "genre", "isbn", "ownerId", "ownerEmail"
    ], [
        req.body.title, req.body.author, req.body.genre, req.body.isbn,
        req.body.ownerId, req.body.ownerEmail
    ], function (result) {
        res.json(result);
    });
});


//When "request to borrow" is clicked, we check for the ISBN # in the "books" table WHERE available = true
router.put("/borrow/:isbn", function (req, res) {
    //First need to set available=false  where isbn=value and checkedOut = false
    //THEN set checkedOut = true where isbn = value
    let isbn2 = req.params.isbn;

    let condition1 = "isbn =" + isbn2;
    let condition2 = "available = true";
    let condition3 = "checkedOut=false";

    //First set available equal to false
    books.updateOneWhere({
        available: req.body.available
    }, condition1, condition2, condition3, function (result) {
        if (result.changedRows == 0) {
            return res.status(400).end();
        } else {
            changeSecondOne();
        }
    });

    //Change checkedOut to be true
    function changeSecondOne() {
        books.updateOne({
            checkedOut: req.body.checkedOut
        }, condition1, function (result) {
            if (result.changedRows == 0) {
                return res.status(400).end();
            } else {
                res.json({ isbn: isbn2 });
            }
        })
    }

});

//We want to be able to get all of the books that are available - maybe we should limit the number of responses?
router.get("/books/available", function (req, res) {
    books.selectWhere("available", 1, function (data) {
        res.json(data);
    });
})

// Export routes for server.js to use.
module.exports = router;
