var db = require("../models");

module.exports = function (app) {

    app.get("/api/booksUser", function (req, res) {

    });

    app.post("/api/bookUser", function (req, res) {
        console.log(req.body);

        db.User.create({
            email: req.body.email,
            password: req.body.password
        }).then(function (dbUser) {
            res.send(dbUser);
            console.log("received")
        })


    });







}