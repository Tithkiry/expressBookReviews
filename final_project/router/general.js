const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const uname = req.body.username;
    const pwd = req.body.password;
    if (uname && pwd) {
        if (!isValid(uname)) {
            users.push({"username": uname, "password": pwd});
            return res.status(200).json({message: "User successfully created."});
        } else return res.status(404).json({message: "User already exists"})
    }
    return res.status(404).json({message: "Unable to register"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    return res.send(book) ;
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author
    let formattedAuthor = author.toLowerCase();
    let booksArray = Object.values(books);
    const book = booksArray.filter((b) => b.author.toLowerCase() === formattedAuthor);
    
    return res.send(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
    let booksArray = Object.values(books);
    const book = booksArray.filter((b)=> b.title.toLowerCase() === title)
  return res.send(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.send(book.reviews);
});

module.exports.general = public_users;
