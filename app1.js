//app1.js
//(a) Write a program to implement the 
// "Hello World" message in the route 
// through the browser using Express
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

/*
Run:
node app.js

Browser:
http://localhost:3000

Output:
Hello World
*/