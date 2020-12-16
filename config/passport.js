const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy
const books = require("../models/books.js");


passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password"

    },
    function (email, password, done) {
        books.selectUser("email", email, function (dbEmail) {

            if (!dbEmail) {
                return done(null, false, {
                    message: "No Email on file"
                });
            }

            return done(null, dbEmail)

        })



    }





))
passport.serializeUser(function (user, cb) {
    cb(null, user);
})
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
})


module.exports = passport;