
/*
Student Management System
CRUD operations using Express and MySQL
Database: school
Server: http://localhost:3000
*/

const express = require("express");
require("dotenv").config();

const app = express();
const db = require("./db5");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read HTML, CSS and JavaScript files from public folder
app.use(express.static("public"));

// GET: Retrieve all students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM student", (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(result);
    });
});

// GET: Retrieve one student by ID
app.get("/students/:sno", (req, res) => {
    db.query(
        "SELECT * FROM student WHERE student_id = ?",
        [req.params.sno],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json(result);
        }
    );
});

// POST: Insert a new student
app.post("/students", (req, res) => {
    const { sno, name, total, age, phone } = req.body;

    db.query(
        "INSERT INTO student (student_id, student_name, total, age, phone) VALUES (?, ?, ?, ?, ?)",
        [sno, name, total, age, phone],
        (err) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.send("Student Inserted");
        }
    );
});

// PUT: Update student details
app.put("/students/:sno", (req, res) => {
    const { name, total, age, phone } = req.body;

    db.query(
        "UPDATE student SET student_name = ?, total = ?, age = ?, phone = ? WHERE student_id = ?",
        [name, total, age, phone, req.params.sno],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Student NOT found");
            }

            res.send("Student Updated");
        }
    );
});

// DELETE: Delete a student by ID
app.delete("/students/:sno", (req, res) => {
    db.query(
        "DELETE FROM student WHERE student_id = ?",
        [req.params.sno],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Student NOT found to delete");
            }

            res.send("Student Deleted");
        }
    );
});

// Start the server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
