require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios = require("axios");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const findOrCreate = require("mongoose-findorcreate");
const { body, validationResult } = require("express-validator");
const { check } = require("express-validator");
const _ = require("lodash");
const e = require("express");

// For Google OAuth 2.0
var GoogleStrategy = require("passport-google-oauth20").Strategy;

// Starting the express app
const app = express();

// Using imported modules
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Global variables
var readingListLoginRequest = false;
var searchResults = [];
var bookAdded = {};
var searchQuery = "";
var userFirstName = "";

// Using passport sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initializing passport
app.use(passport.initialize());
app.use(passport.session());

// Connecting to database
// mongoose.connect("mongodb+srv://AryanK1511:" + process.env.MONGO_ATLAS_PASSKEY + "@bookworm.qvd4tsp.mongodb.net/BookWorm", {useNewUrlParser: true});

mongoose.connect("mongodb://localhost:27017/BookWorm", {
  useNewUrlParser: true,
});

// Creating a schema for the books database
const bookSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  bookName: {
    type: String,
    required: [true, "No name has been provided for the book."],
  },
  bookAuthor: String,
});

// Creating a schema for the database that stores user data
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  googleId: String,
});

// Adding plugins to the databases
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Creating collections / models
const User = new mongoose.model("User", userSchema);
const Book = new mongoose.model("Book", bookSchema);

// Create a strategy and serialize and deserialize cookies
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Setting up google authentication strategy using passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/bookworm-authentication",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// ========== HOME ROUTE =========
app.get("/", (req, res) => {
  readingListLoginRequest = false;
  res.render("Index", {
    user: req.user,
  });
});

// ========== LOGIN ROUTE ========
app.get("/login", (req, res) => {
  res.render("Login");
});

// ========== REGISTER ROUTE =========
app.get("/register", (req, res) => {
  res.render("Register");
});

// ========== SEARCH RESULTS ROUTE =========
app.get("/search-results", (req, res) => {
  if (searchQuery === null || searchQuery === "") {
    res.redirect("/");
  } else {
    res.render("searchResults", { user: req.user });
  }
});

// ========== READING LIST ROUTE ==========
app.get("/reading-list", (req, res) => {
  // Checking whether the user is authenticated
  if (req.isAuthenticated()) {
    // Locating the user in our database and storing the book in the database
    User.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          userFirstName = foundUser.firstName;

          // Checking to see whether a book was added]
          if (Object.keys(bookAdded).length === 0) {

            // Finding all the books in list
            Book.find({ userId: req.user.id }, function (err, books) {
              if (err) {
                console.log(err);
              } else {
                // Rendering the reading list page
                res.render("ReadingList", {
                  userBookData: books,
                  user: req.user,
                  userFirstName: userFirstName,
                });
              }
            })
          } else {
            // Creating a book object for user
            const book = new Book({
              userId: req.user.id,
              bookId: bookAdded.id,
              bookName: bookAdded.volumeInfo.title,
              bookAuthor: bookAdded.volumeInfo.authors.join(", "),
            });

            // Saving the book object
            book.save(function (err) {
              if (err) {
                console.log(err);
              } else {
                // Finding the book 
                Book.find({ userId: req.user.id }, function (err, books) {
                  if (err) {
                    console.log(err);
                  } else {
                    // Rendering the reading list page
                    res.render("ReadingList", {
                      userBookData: books,
                      user: req.user,
                      userFirstName: userFirstName,
                    });
                  }
                });
              }
            });
          }
        }
      }
    });
  } else {
    readingListLoginRequest = true;
    res.render("Login");
  }
});

// ====================== LOGOUT ROUTE ===================
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// ========== POSTING USING THE SEARCH FORM ==========
app.post("/search-results", (req, res) => {
  const query = String(req.body.book);
  searchQuery = query;

  // If there is no query
  if (query === null || query === "") {
    res.redirect("/");
  } else {
    const apiKey = String(process.env.API_KEY);
    const url =
      "https://www.googleapis.com/books/v1/volumes?q=" +
      query +
      "&key=" +
      apiKey;

    // Using axios for api get request
    axios
      .get(url)
      .then((result) => {
        // Pushing all items in the searchResults array to crreate an array of objects
        for (let i = 0; i < result.data.items.length; i++) {
          searchResults.push(result.data.items[i]);
        }
        // Rendering the search results
        res.render("SearchResults", {
          bookData: result.data.items,
          user: req.user,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

// =========== Posting to the register route ==========
app.post(
  "/register",
  [
    check("firstname", "First name is a required field").exists(),
    check("username", "Username must be a valid email").exists().isEmail(),
    check("password", "Password must be atleast 5 characters long")
      .exists()
      .isLength({ min: 5 }),
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("register", { errors: errors.errors });
    } else {
      // Registering the user to our application and storing their data in our database
      User.register(
        {
          username: req.body.username,
          firstName: req.body.firstname,
          lastName: req.body.lastname,
        },
        req.body.password,
        function (err) {
          if (err) {
            console.log(err);
            res.redirect("/register");
          } else {
            passport.authenticate("local")(req, res, function () {
              res.redirect("/");
            });
          }
        }
      );
    }
  }
);

// =========== Posting to the login route ==========
app.post("/login", (req, res) => {
  // Logging in the user by checking if the credentials match using passport
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  // Using passport to login the user and authenticate them
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local", { failureRedirect: "/login" })(
        req,
        res,
        function () {
          userFirstName = "";
          // Checking whether the login was requested manually or to access the reading list
          if (readingListLoginRequest) {
            res.redirect("/reading-list");
          } else {
            res.redirect("/");
          }
        }
      );
    }
  });
});

// ============ THE ADD TO READING LIST ROUTE  ===========
app.get("/reading-list/:bookId", (req, res) => {
  const bookId = req.params.bookId;

  // Saving the book that is supposed to be added in the bookAdded global variable
  for (let i = 0; i < searchResults.length; i++) {
    if (String(searchResults[i].id) === String(bookId)) {
      bookAdded = searchResults[i];
    }
  }

  // Emptying the search results array
  searchResults = [];

  // Redirecting to the reading list route
  res.redirect("/reading-list");
});

// ============ THE DELETE FROM READING LIST ROUTE  ===========
app.get("/delete/:bookId", (req, res) => {
  const bookId = req.params.bookId;

  // Deleting the book from the database
  Book.deleteOne(
    { userId: req.user.id, bookId: bookId },
    function (err, foundList) {
      if (err) {
        console.log(err);
      } else {
        // Redirecting to the reading list route
        bookAdded = {};
        res.redirect("/reading-list");
      }
    }
  );
});

// ========== GOOGLE AUTHENTICATION ==========
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/bookworm-authentication",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Checking whether the login was requested manually or to access the reading list
    if (readingListLoginRequest) {
      userFirstName = "";
      res.redirect("/reading-list");
    } else {
      res.redirect("/");
    }
  }
);

// ========== Listening for requests ==========
let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server has successfully started.");
});
