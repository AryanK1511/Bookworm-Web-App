const express = require("express");
const mongoose = require("mongoose");

// Starting the express app
const app = express();

// Connecting to database
mongoose.connect("mongodb+srv://AryanK1511:<password>@bookworm.qvd4tsp.mongodb.net/?retryWrites=true&w=majority/BooksDB", {useNewUrlParser: true});

// Creating a schema for the database
const bookSchema = new mongoose.Schema ({
    bookName: {
        type: String,
        required: [true, "No name has been provided for the book."]
    },
    bookAuthor: String,
    DateAdded: String
});

// Listening for requests
let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server has successfully started.");
})