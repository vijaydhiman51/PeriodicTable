const db = require("../models/db");

// Get all users
exports.getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0) return res.status(404).send("User not found");
      res.json(result[0]);
    }
  );
};

// Create new user
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id: result.insertId, name, email });
    }
  );
};

// Update user
exports.updateUser = (req, res) => {
  const { name, email } = req.body;
  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("User updated successfully");
    }
  );
};

// Delete user
exports.deleteUser = (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User deleted successfully");
  });
};
