const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// safe file path
const filePath = path.join(__dirname, "todos.json");

// ---------------- HELPERS ----------------

// read todos safely
const getTodos = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
};

// write todos safely
const saveTodos = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// ---------------- CREATE TODO ----------------
router.post("/", (req, res) => {
  if (!req.body || !req.body.title) {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  const todos = getTodos();

  const newTodo = {
    id: Date.now(),
    title: req.body.title.trim(),
    completed: false
  };

  todos.push(newTodo);
  saveTodos(todos);

  res.status(201).json(newTodo);
});

// ---------------- GET ALL TODOS ----------------
router.get("/", (req, res) => {
  const todos = getTodos();
  res.json(todos);
});

// ---------------- GET SINGLE TODO ----------------
router.get("/:id", (req, res) => {
  const todos = getTodos();

  const todo = todos.find(
    (t) => t.id === Number(req.params.id)
  );

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found"
    });
  }

  res.json(todo);
});

// ---------------- UPDATE TODO ----------------
router.put("/:id", (req, res) => {
  const todos = getTodos();

  const index = todos.findIndex(
    (t) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Todo not found"
    });
  }

  todos[index] = {
    ...todos[index],
    ...req.body
  };

  saveTodos(todos);

  res.json({
    message: "Todo updated successfully",
    todo: todos[index]
  });
});

// ---------------- DELETE TODO ----------------
router.delete("/:id", (req, res) => {
  let todos = getTodos();

  const filteredTodos = todos.filter(
    (t) => t.id !== Number(req.params.id)
  );

  if (filteredTodos.length === todos.length) {
    return res.status(404).json({
      message: "Todo not found"
    });
  }

  saveTodos(filteredTodos);

  res.json({
    message: "Todo deleted successfully"
  });
});

module.exports = router;