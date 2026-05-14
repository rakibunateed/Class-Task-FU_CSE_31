const express = require("express");

const app = express();

app.use(express.json());

const todoRoutes = require("./routes/routes");

app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("Todo API is running");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});