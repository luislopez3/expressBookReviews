const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;

  const findBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];

    if (book) {
      resolve(book);
    } else {
      reject(`Book with ISBN ${isbn} not found`);
    }
  });

  findBookByISBN
    .then(book => {
      res.status(200).json({ book });
    })
    .catch(errorMessage => {
      res.status(404).json({ message: errorMessage });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;

  const findBooksByAuthor = new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (const key in books) {
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(`No books found by author ${author}`);
    }
  });

  findBooksByAuthor
    .then(matchingBooks => {
      res.status(200).json({ books: matchingBooks });
    })
    .catch(errorMessage => {
      res.status(404).json({ message: errorMessage });
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;

  const findBooksByTitle = new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (const key in books) {
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(`No books found with title "${title}"`);
    }
  });

  findBooksByTitle
    .then(matchingBooks => {
      res.status(200).json({ books: matchingBooks });
    })
    .catch(errorMessage => {
      res.status(404).json({ message: errorMessage });
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: `No reviews found for book with ISBN ${isbn}` });
  }
});

module.exports.general = public_users;
