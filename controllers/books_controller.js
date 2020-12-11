const express = require("express");
const orm = require("../config/orm.js");

const router = express.Router();

// Import the model (cat.js) to use its database functions.
const bookbook = require("../models/books.js");

router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

//Server side API calls go here

const gbooksAPIkey = "AIzaSyBbP25k0xQFGGCWKgeCDngvaUC3_ufLXNs";
// Export routes for server.js to use.
module.exports = router;