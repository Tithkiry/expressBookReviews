import axios from "axios";
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Change this port if your Express app runs on another port
const API_URL = "http://localhost:5000";

// Internal API endpoint for Axios consumption
public_users.get('/allbooks', (req, res) => {
    return res.status(200).json(books);
});

// User Registration Route
public_users.post("/register", (req, res) => {
    const uname = req.body.username;
    const pwd = req.body.password;

    if (uname && pwd) {
        if (!isValid(uname)) {
            users.push({
                username: uname,
                password: pwd
            });

            return res.status(200).json({
                message: "User successfully created."
            });
        }

        return res.status(409).json({
            message: "User already exists"
        });
    }

    return res.status(400).json({
        message: "Unable to register: Missing credentials"
    });
});

// Task 10: Get all books using Axios + Async/Await
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(
            `${API_URL}/customer/allbooks`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Cannot Fetch Book Data"
        });
    }
});

// Task 11: Get book by ISBN using Axios + Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(
            `${API_URL}/customer/allbooks`
        );

        const booksData = response.data;
        const isbn = req.params.isbn;
        const book = booksData[isbn];

        if (!book) {
            return res.status(404).json({
                message: "Book with this ISBN not found"
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error finding book"
        });
    }
});

// Task 12: Get books by author using Axios + Async/Await
public_users.get('/author/:author', async function (req, res) {
    try {
        const response = await axios.get(
            `${API_URL}/customer/allbooks`
        );

        const booksData = response.data;
        const author = req.params.author.toLowerCase();

        const booksArray = Object.values(booksData);

        const filteredBooks = booksArray.filter(
            (book) =>
                book.author &&
                book.author.toLowerCase() === author
        );

        if (filteredBooks.length === 0) {
            return res.status(404).json({
                message: "No books found for this author"
            });
        }

        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while filtering books by author"
        });
    }
});

// Task 13: Get books by title using Axios + Async/Await
public_users.get('/title/:title', async function (req, res) {
    try {
        const response = await axios.get(
            `${API_URL}/customer/allbooks`
        );

        const booksData = response.data;
        const title = req.params.title.toLowerCase();

        const booksArray = Object.values(booksData);

        const filteredBooks = booksArray.filter(
            (book) =>
                book.title &&
                book.title.toLowerCase() === title
        );

        if (filteredBooks.length === 0) {
            return res.status(404).json({
                message: "No books found with this title"
            });
        }

        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while filtering books by title"
        });
    }
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;