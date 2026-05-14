const express = require("express");
const app = express();

// middleware
app.use(express.json());

// routes
const todoRoutes = require("./routes");
app.use("/api/todos", todoRoutes);

// simple health check route
app.get("/", (req, res) => {
  res.send("Todo API is running");
});

// server start
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});