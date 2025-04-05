const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user.routes");
const tableRoutes = require("./routes/periodicTable.routes");

app.use(express.json());

app.use(cors());
/* app.use(cors({
  origin: 'http://127.0.0.1:3000'
})); */

app.use("/api/users", userRoutes);
app.use("/api/periodicTable", tableRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
