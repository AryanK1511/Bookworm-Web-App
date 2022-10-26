require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const https = require("https");

// Starting the express app
const app = express();

// Using imported modules
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Connecting to database
mongoose.connect("mongodb+srv://AryanK1511:" + process.env.MONGO_ATLAS_PASSKEY + "@bookworm.qvd4tsp.mongodb.net/?retryWrites=true&w=majority/BooksDB", {useNewUrlParser: true});

// Creating a schema for the books database
const bookSchema = new mongoose.Schema ({
    bookName: {
        type: String,
        required: [true, "No name has been provided for the book."]
    },
    bookAuthor: String,
    DateAdded: String
});

// Creating a schema for the database that stores user data
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    bookData: bookSchema
});

// ========== HOME ROUTE =========
app.get("/", (req, res) => {
    res.render("Index");
})

// ==================== LOGIN ROUTE ===================
app.get("/login", (req, res) => {
    res.render("Login");
});

// ==================== REGISTER ROUTE ====================
app.get("/register", (req, res) => {
    res.render("Register");
});

// ========== SEARCH RESULTS ROUTE =========
app.get("/search-results", (req, res) => {
    res.render("searchResults");
})

// ========== POSTING USING THE SEARCH FORM ==========
app.post("/search-results", (req, res) => {
    const query = String(req.body.book);
    const apiKey = String(process.env.API_KEY);
    const url = "https://www.googleapis.com/books/v1/volumes?q=" + query + "&key=" + apiKey;

    // Using the native node https module
    https.get(url, (response) => {
        let result = '';
        response.on("data", (data) => {
            result += data;
        })
        response.on('end', () => {
            const bookData = JSON.parse(result);
            // Pushing all the search results into our array
            // console.log(bookData.items[9].id);
            // Rendering the search results page and sending the array
        res.render("searchResults", {bookData: bookData});
        });
    })
})

// Listening for requests
let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server has successfully started.");
})