const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.login = (req, res) => {
  const { username, password } = req.body;
  try {
    db.execute(
      "SELECT * FROM user_login WHERE UPPER(username) = UPPER(?)",
      [username],
      (err, rows, fields) => {
        if (err) {
          console.error("Query error:", err);
          return;
        }

        if (rows.length === 0) {
          return res.status(401).json({ message: "Invalid username or password" });
        }
    
        const user = rows[0];
    
        const passwordMatches = bcrypt.compareSync(password, user.password_hash);
    
        if (!passwordMatches) {
          return res.status(401).json({ message: "Invalid username or password" });
        }
    
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
    
        res.json({ message: "Login successful", token, username: user.username });
      }
    );   
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = (req, res) => {
  db.query("SELECT * FROM periodicelements", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};
