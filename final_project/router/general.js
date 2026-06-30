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
public_users.get('/', async function (req, res) {
  //Write your code here
  try{
    let fetchBook = () => {
        return new Promise((resolve) => resolve(books))
    }
    const data = await fetchBook();
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(403).json({message: "Cannot Fetch Book Data"});
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const fetchBook = () =>  new Promise((resolve) => resolve(book));

    let data = await fetchBook();
    return res.status(200).send(data);
  } catch (error) {
    return res.status(403).json({message: "Cannot find this book"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author
    let formattedAuthor = author.toLowerCase();
    let booksArray = Object.values(books);
    const book = booksArray.filter((b) => b.author.toLowerCase() === formattedAuthor);
    
    const fetchBook = () =>  new Promise((resolve) => resolve(book));
    let data = await fetchBook();
    return res.status(200).send(data);
  } catch (error) {
    return res.status(403).json({message: "Cannot find this book"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();
        let booksArray = Object.values(books);
        const book = booksArray.filter((b)=> b.title.toLowerCase() === title)
      
        const fetchBook = () =>  new Promise((resolve) => resolve(book));
        let data = await fetchBook();
        return res.status(200).send(data);
    } catch (error) {
    return res.status(403).json({message: "Cannot find this book"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.send(book.reviews);
});

module.exports.general = public_users;
