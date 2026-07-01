const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User Registration Route
public_users.post("/register", (req, res) => {
    const uname = req.body.username;
    const pwd = req.body.password;

    // Validate that both username and password are provided in the request body
    if (uname && pwd) {
        // Check if the username is unique and valid for registration
        if (!isValid(uname)) {
            users.push({"username": uname, "password": pwd});
            return res.status(200).json({message: "User successfully created."});
        } else {
            // Conflict status code (409) or Bad Request (400) is preferred here over 404
            return res.status(400).json({message: "User already exists"});
        }
    }
    return res.status(400).json({message: "Unable to register: Missing credentials"});
});

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
    try {
        // Return the entire books object compiled from the local database
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        // Fallback catch block for server or data formatting exceptions
        return res.status(500).json({message: "Cannot Fetch Book Data"});
    }
});

// Task 11: Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        // Explicitly check if the book exists in the key-value structure
        if (!book) {
            return res.status(404).json({ message: "Book with this ISBN not found" });
        }
        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({message: "Internal server error finding book"});
    }
});
  
// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        let formattedAuthor = author.toLowerCase();
        
        // Convert the database object into an array to enable filtering mechanisms
        let booksArray = Object.values(books);
        
        // Filter out books where the author properties match, ignoring casing variations
        const filteredBooks = booksArray.filter((b) => b.author.toLowerCase() === formattedAuthor);
        
        // CRITICAL CHECK: Array.prototype.filter() returns an empty array [] if no matches are found.
        // We must check the length property to accurately identify if the author query returned nothing.
        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found for this author" });
        }
        
        // Return matching records found
        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({message: "An error occurred while filtering books by author"});
    }
});

// Task 13: Get all books based on title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();
        let booksArray = Object.values(books);
        
        // Filter out records matching the specified book title
        const filteredBooks = booksArray.filter((b) => b.title.toLowerCase() === title);
      
        // CRITICAL CHECK: Validate whether any matching title objects made it into the filtered result set
        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }
        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({message: "An error occurred while filtering books by title"});
    }
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    // Fallback safety check to see if the book exist before attempting to fetch its reviews key
    if (!book) {
        return res.status(404).json({message: "Book not found"});
    }
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;