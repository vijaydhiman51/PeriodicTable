const express = require("express");
const cors = require("cors");
const app = express();
const loginRoutes = require("./routes/login.routes");
const tableRoutes = require("./routes/periodicTable.routes");
const feedbackRoutes = require("./routes/feedback.routes");

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins (that are not undefined — like Postman or curl)
    if (!origin) return callback(null, false);
    return callback(null, origin);
  },
  credentials: true
}));

app.use("/api/login", loginRoutes);
app.use("/api/periodicTable", tableRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
