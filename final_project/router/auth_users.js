const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userWithSameName = users.filter((user) => user.username === username);
    if (userWithSameName.length > 0) {
        return true;
    } else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => 
    user.username===username && user.password===password)

    if (validUsers.length > 0) {
        return true;
    } else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const uname = req.body.username;
  const pwd = req.body.password;

  if (!uname || !pwd) return res.status(404).json({message: "Missing Username or Password"});

  if (authenticatedUser(uname, pwd)) {
    let accessToken = jwt.sign({data: uname}, "access", {expiresIn: 60*60});
    req.session.authorization = {accessToken, uname}
    return res.status(200).json({message: "User sucessfully logged in"});
  } else return res.status(208).json({message: "Such user does not exist"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const addedReview = req.body.review;
  let book = books[isbn].reviews;

  const uname = req.session.authorization.uname;
  books[isbn].reviews[uname] = addedReview;
  
//   return res.status(200).json({
//       message: `Review of user ${uname} has been added/updated.`,
//       reviews: book
//   });
    return res.send(addedReview)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
