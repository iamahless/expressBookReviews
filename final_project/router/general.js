const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: `Invalid request: Username and/or password required`});
    }
    if (users.find((user) => user.username === username)) {
        return res.status(409).json({message: "Username already exists"});
    }

    users.push({username, password});
    return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

    await new Promise((resolve, reject) => {
        if (Object.values(books).length) {
            resolve(books);
        } else {
            reject("Error retrieving book list");
        }
    })
        .then((data) => res.json({data: data}))
        .catch((err) => res.status(500).json(err));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    const bookId = req.params.isbn;

    await new Promise((resolve, reject) => {
        if (books[bookId]) {
            resolve(books[bookId]);
        } else {
            reject(`No Book with ISBN ${isbn} found`);
        }
    })
        .then((data) => res.json({data: data}))
        .catch((err) => res.status(404).json({message: err}));
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    const author = req.params.author.toLowerCase();

    await new Promise((resolve, reject) => {
        let bookList = [];
        for (key in books) {
            if (books[key].author.toLowerCase().includes(author)) {
                bookList.push(books[key]);
            }
        }
        if (bookList.length) {
            return resolve(bookList);
        }
        return reject('No books found for the author');
    })
        .then((data) => res.status(200).json({data: data}))
        .catch((err) => res.status(404).json({message: err}));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    const title = req.params.title.toLowerCase();

    await new Promise((resolve, reject) => {
        let bookList = [];
        for (key in books) {
            if (books[key].title.toLowerCase().includes(title)) {
                bookList.push(books[key]);
            }
        }
        if (bookList.length) {
            return resolve(bookList);
        }
        return reject('No books found for the title');
    })
        .then((data) => res.json({data: data}))
        .catch((err) => res.status(404).json({message: err}));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    if (books[isbn]) {
        const hasReviews = Object.values(books[isbn].reviews).length;
        return res.json({message: hasReviews ? books[isbn].reviews : 'This book has not reviews yet'});
    }

    return res.status(404).json({message: 'Book not found'});
});

module.exports.general = public_users;
