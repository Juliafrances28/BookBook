var express = require("express");

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

var app = express();

//These are needed for the environmental variables needed for the books API
//const dotenv = require('dotenv');
//dotenv.config();
require('dotenv').config();

const API_KEY = process.env.API_KEY;


// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import routes and give the server access to them.
var routes = require("./controllers/books_controller.js");

app.use(routes);

require("./routes/html-routes.js")(app);
// Start our server so that it can begin listening to client requests.

app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});

