const express = require("express");
const cors = require("cors");
const students = require("./student");

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// API route
app.get("/student", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const formatted = "[\n" + students.map(s => JSON.stringify(s, null, 2)).join(",\n\n") + "\n]";
    res.send(formatted);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});