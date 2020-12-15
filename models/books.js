// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

const books = {
    //Will fill in based on group discussion 
    selectAll: function (cb) {
        orm.selectAll("books", function (res) {
            cb(res);
        })
    },
    allUsers: function (cb) {
        orm.selectAll("users", function (res) {
            cb(res);
        })
    },
    selectWhere: function (col, vals, cb) {
        orm.selectWhere("books", col, vals, function (res) {
            cb(res);
        })
    },
    insertOne: function (cols, vals, cb) {
        orm.insertOne("books", cols, vals, function (res) {
            cb(res);
        })
    },
    updateOne: function (objColVals, condition, cb) {
        orm.updateOne("books", objColVals, condition, function (res) {
            cb(res);
        })
    },
    deleteOne: function (condition, cb) {
        orm.deleteOne("books", condition, function (res) {
            cb(res);
        })
    },
    //Needed to create this function to add user to the users table of the database
    createUser: function (cols, vals, cb) {
        orm.create("users", cols, vals, function (res) {
            cb(res);
        });
    }
}
// Export the database functions for the controller (catsController.js).
module.exports = books;