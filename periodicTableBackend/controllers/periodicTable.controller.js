const db = require("../models/db");

// Get all users
exports.getAll = (req, res) => {
  db.query("SELECT * FROM periodicelements", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Get user by ID
exports.getBySymbol = (req, res) => {
  let symbol = req.params.symbol.toUpperCase();
  db.query(
    "SELECT * FROM periodicelements WHERE Symbol = ?",
    [symbol],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0) return res.status(404).send("Element not found");
      res.json(result[0]);
    }
  );
};

//wild card seacrh

exports.search = (req, res) => {
  let pattern = req.query.query || "%";
  if (pattern.length > 0 && !pattern.includes("%")) {
    pattern = "%" + pattern + "%";
  }
  db.query(
    "SELECT Name, Symbol FROM periodicelements WHERE UPPER(Name) LIKE UPPER(?) OR UPPER(Symbol) LIKE (?)",
    [pattern, pattern],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
};
