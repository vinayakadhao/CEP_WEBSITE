const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your DB password
  database: "your_db_name"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// Register user
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("User registered successfully");
  });
});

// Login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send("Invalid credentials");

    const user = results[0];

    // Update last visited date
    const updateSql = "UPDATE users SET last_visited = NOW() WHERE id = ?";
    db.query(updateSql, [user.id]);

    res.send({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        lastVisited: user.last_visited
      }
    });
  });
});

// Get password (Forgot Password)
app.post("/get-password", (req, res) => {
  const { name, username, email } = req.body;
  const sql = "SELECT password FROM users WHERE name = ? AND email = ?";
  db.query(sql, [name, email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("User not found");
    res.send({ password: results[0].password });
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
