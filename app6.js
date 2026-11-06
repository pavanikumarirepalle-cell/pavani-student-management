
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// MySQL connection settings
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// TEST DATABASE
app.get("/testdb", (req, res) => {
    db.query("SELECT 1 AS test", (err, result) => {
        if (err) {
            console.error("TEST DB ERROR:", err);
            return res.status(500).send(err.message);
        }

        res.json(result);
    });
});

// READ ALL STUDENTS
app.get("/students", (req, res) => {
    db.query("SELECT * FROM student", (err, result) => {
        if (err) {
            console.error("READ STUDENTS ERROR:", err);
            return res.status(500).send(err.message);
        }

        res.json(result);
    });
});

// READ ONE STUDENT
app.get("/students/:student_id", (req, res) => {
    db.query(
        "SELECT * FROM student WHERE student_id = ?",
        [req.params.student_id],
        (err, result) => {
            if (err) {
                console.error("READ ONE STUDENT ERROR:", err);
                return res.status(500).send(err.message);
            }

            if (result.length === 0) {
                return res.status(404).send("Student Not Found");
            }

            res.json(result[0]);
        }
    );
});

// INSERT STUDENT
app.post("/students", (req, res) => {
    const { student_id, student_name, total, age, phone } = req.body;

    if (
        student_id == null ||
        !student_name ||
        total == null ||
        age == null ||
        phone == null
    ) {
        return res.status(400).send(
            "Provide student_id, student_name, total, age and phone"
        );
    }

    db.query(
        "INSERT INTO student (student_id, student_name, total, age, phone) VALUES (?, ?, ?, ?, ?)",
        [student_id, student_name, total, age, phone],
        (err, result) => {
            if (err) {
                console.error("INSERT STUDENT ERROR:", err);
                return res.status(500).send(err.message);
            }

            res.status(201).send("Student Inserted Successfully");
        }
    );
});

// UPDATE STUDENT
app.put("/students/:student_id", (req, res) => {
    const { student_name, total, age, phone } = req.body;

    if (
        !student_name ||
        total == null ||
        age == null ||
        phone == null
    ) {
        return res.status(400).send(
            "Provide student_name, total, age and phone"
        );
    }

    db.query(
        "UPDATE student SET student_name = ?, total = ?, age = ?, phone = ? WHERE student_id = ?",
        [student_name, total, age, phone, req.params.student_id],
        (err, result) => {
            if (err) {
                console.error("UPDATE STUDENT ERROR:", err);
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Student Not Found");
            }

            res.send("Student Updated Successfully");
        }
    );
});

// DELETE STUDENT
app.delete("/students/:student_id", (req, res) => {
    db.query(
        "DELETE FROM student WHERE student_id = ?",
        [req.params.student_id],
        (err, result) => {
            if (err) {
                console.error("DELETE STUDENT ERROR:", err);
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Student Not Found");
            }

            res.send("Student Deleted Successfully");
        }
    );
});

// TEST DATABASE CONNECTION BEFORE STARTING SERVER
db.connect((err) => {
    if (err) {
        console.error("MYSQL CONNECTION FAILED:", err);
        return;
    }

    console.log("Mamatha! Connected to MySQL Database");

    // Test a query before accepting requests
    db.query("SELECT 1", (queryErr) => {
        if (queryErr) {
            console.error("MYSQL TEST QUERY FAILED:", queryErr);
            db.destroy();
            return;
        }

        console.log("MySQL test query successful");

        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000");
        });
    });
});
