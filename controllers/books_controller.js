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


router.get("/", function (req, res) {
    console.log("Sent to home because no user was found")
    //we should not have req.user since they did not pass authentication and were redirected here 
    // console.log(req)
    res.sendFile(path.join(__dirname, "../public/html/registration.html"), { message: req.flash("test") });

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
        console.log(scrambled);
        books.createUser(["first_name", "last_name", "email", "secret"], [req.body.first_name, req.body.last_name, req.body.email, scrambled], function (result) {

        })



    } catch (error) {
        if (error)
            throw error;

    }
    res.redirect("/login")

    console.log("Sent to login ")


})


router.get("/login", function (req, res) {
    console.log("heres login!")
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
    console.log("test")
    //  res.json(req.user)
    // res.send(req.user)

})



router.get("/home", function (req, res) {
    //after authenticate that happends in the post login route, the redirect to /home makes req.user available
    res.sendFile(path.join(__dirname, "../public/html/homepage.html"));
    console.log("Made it to home page!")
})

// router.get("/home", isUser, function (req, res) {
//     //after authenticate that happends in the post login route, the redirect to /home makes req.user available
//     res.sendFile(path.join(__dirname, "../public/html/homepage.html"));
//     console.log("Made it to home page!")
// })

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


//Gets entry from table from book id
router.get("/api/bookById/:id", function (req, res) {
    let id = req.params.id;
    books.selectWhere("isbn", id, function (data) {
        res.json(data);
    })
});


//Gets entry from table from book by ownerId
router.get("/api/bookByOwnerId/:id", function (req, res) {
    //let id = req.user.id;
    id = 1
    books.selectWhere("ownerId", id, function (data) {
        // console.log("owned books: " + data )
        res.json(data);
    })
});


//User can mark a book as Unavailble for borrowing
router.put("/api/bookUnavailable/:bookId", function (req, res) {
    //change availability from true to false
    //change checkedout from false to true


    let condition = "id = " + req.params.bookId;
    //console.log("the condition is " + condition)

    books.updateOne({
        available: false
    }, condition, function (result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            let id = req.params.bookId;
            console.log("\n \n \n \n \n " + id + "\n \n \n ")
            books.selectWhere("id", 1, function (data) {
                //console.log("the data in book from the update request is \n \n \n  " + JSON.stringify(data))
                return res.json(data)

            })

        }
    });


});


//User can mark a book as Availble for borrowing
router.put("/api/bookAvailable/:bookId", function (req, res) {
    //change availability from true to false
    //change checkedout from false to true


    let condition = "id = " + req.params.bookId;
    //console.log("the condition is " + condition)

    books.updateOne({
        available: true
    }, condition, function (result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            let id = req.params.bookId;
            console.log("\n \n \n \n \n " + id + "\n \n \n ")
            books.selectWhere("id", 1, function (data) {
                //console.log("the data in book from the update request is \n \n \n  " + JSON.stringify(data))
                return res.json(data)

            })

        }
    });


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

//Can mark a book as returned
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

//We want to add an item to the wishlist
router.post("/wishlist", function (req, res) {
    books.insertOneWish([
        "userId", "title", "author", "isbn"
    ], [
        req.body.data.userId, req.body.data.title, req.body.data.author, req.body.data.isbn
    ], function (result) {
        res.json(result);
    })
})
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
        "title", "author", "genre", "isbn", "ownerId", "ownerEmail", "imgUrl"
    ], [
        req.body.title, req.body.author, req.body.genre, req.body.isbn,
        req.body.ownerId, req.body.ownerEmail, req.body.imgUrl
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
    let condition3 = "borrowed=false";

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

    //Change borrowed to be true
    function changeSecondOne() {
        books.updateOne({
            borrowed: req.body.checkedOut
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


// API route to get logged in user's data
router.get("/api/user_data", function (req, res) {

    let user
    if (!req.user) {

        console.log("retrieving test user")
        books.selectUser('id', 1, function (result) {
            console.log(result)

        //console.log("retrieving test user")
        books.selectUser('id', 1, function (result) {
            //console.log(result)

            user = {
                id: result[0].id,
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                email: result[0].email,
            }

            console.log("this is the test user \n " + JSON.stringify(user))

            res.json({ user })
        })

    }
    else {

        books.selectUser('id', req.user.id, function (result) {
            console.log(result)
            console.log("this is the user info \n " + JSON.stringify(user))
            user = {
                id: result[0].id,
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                email: result[0].email,
            }
            res.json({ user })

        user = {
            id: req.user.id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
        }

        /* books.selectUser('id', req.user.id, function (result){
             console.log(result)
             console.log("this is the user info \n " + JSON.stringify(user))
             user = {
                 id : result[0].id,
                 first_name: result[0].first_name,
                 last_name: result[0].last_name,
                 email: result[0].email,
             }
                
         })*/
        res.json({ user })
        //console.log("sent Json with User info")
    }

})

//When a book in the "available" section is clicked it is marked as borrowed
//To mark a book as borrowed from the available list
router.put("/available/borrow/:id", function (req, res) {
    //First need to set available=false  where isbn=value and checkedOut = false
    //THEN set checkedOut = true where isbn = value
    let id = req.params.id;

    let condition1 = "id=" + id;
    let condition2 = "available = true";
    let condition3 = "borrowed = false";

    //First set available equal to false
    books.updateOneWhere({
        available: false
    }, condition1, condition2, condition3, function (result) {
        if (result.changedRows == 0) {
            return res.status(400).end();
        } else {
            changeSecondOne();
        }
    });

    //Change borrowed to be true
    function changeSecondOne() {
        books.updateOne({
            borrowed: true
        }, condition1, function (result) {
            if (result.changedRows == 0) {
                return res.status(400).end();
            } else {
                res.json({ id: id });
            }
        })
    }


})


});

//When a book from the available list is borrowed, we want to insert the userId as the borrowed id
router.put("/insert/:borrowerId/:bookId", function (req, res) {
    let borrowerId = req.params.borrowerId;
    let bookId = req.params.bookId;
    let condition = "id = " + bookId;


    books.updateOne({
        "borrowerId": borrowerId
    }, condition, function (result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            res.json({ id: req.params.id });
        }
    });

});

//Inserts a borrowers email into the table
router.put("/insertemail/:borrowerEmail/:bookId", function (req, res) {
    let borrowerEmail = req.params.borrowerEmail;
    let bookId = req.params.bookId;
    let condition = "id = " + bookId;

    books.updateOne({
        "borrowerEmail": borrowerEmail
    }, condition, function (result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            res.json({ id: req.params.id });
        }
    });
})

// Export routes for server.js to use.
module.exports = router;
