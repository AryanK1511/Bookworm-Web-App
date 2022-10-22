require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Starting the express app
const app = express();

// Using imported modules
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Connecting to database
mongoose.connect("mongodb+srv://AryanK1511:" + process.env.MONGO_ATLAS_PASSKEY + "@bookworm.qvd4tsp.mongodb.net/?retryWrites=true&w=majority/BooksDB", {useNewUrlParser: true});

// Creating a schema for the database
const bookSchema = new mongoose.Schema ({
    bookName: {
        type: String,
        required: [true, "No name has been provided for the book."]
    },
    bookAuthor: String,
    DateAdded: String
});

// ========== HOME ROUTE =========
app.get("/", (req, res) => {
    res.render("index.ejs");
})

// Listening for requests
let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server has successfully started.");
})