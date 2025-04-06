const db = require("../models/db");
const verifyToken = require('../middleware/auth');

// Get all users
exports.getAll = (req, res) => {
  db.query("SELECT * FROM feedback", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Get user by ID
exports.saveFeedback = (req, res) => {
    const { name, message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }
  
    const sql = 'INSERT INTO feedback (name, message) VALUES (?, ?)';
    const values = [name?.trim() || null, message.trim()];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting feedback:', err);
        return res.status(500).json({ success: false, error: 'Database error.' });
      }
      return res.status(200).json({ success: true, message: 'Feedback submitted.' });
    });
};
