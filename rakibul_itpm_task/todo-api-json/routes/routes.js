const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../todos.json");

const getTodos = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const saveTodos = (data) => {
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.log("Error writing file:", err);
  }
};

// CREATE TODO
router.post("/", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  const todos = getTodos();

  const newTodo = {
    id: Date.now(),
    title: title.trim(),
    completed: false,
  };

  todos.push(newTodo);

  saveTodos(todos);

  return res.status(201).json(newTodo);
});

// GET ALL TODOS
router.get("/", (req, res) => {
  const todos = getTodos();

  return res.json(todos);
});

// GET SINGLE TODO
router.get("/:id", (req, res) => {
  const todos = getTodos();

  const todo = todos.find(
    (t) => t.id === Number(req.params.id)
  );

  if (!todo) {
    return res.status(404).json({
      error: "Todo not found",
    });
  }

  return res.json(todo);
});

// UPDATE TODO
router.put("/:id", (req, res) => {
  const todos = getTodos();

  const index = todos.findIndex(
    (t) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Todo not found",
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({
        error: "Title cannot be empty",
      });
    }

    todos[index].title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "Completed must be boolean",
      });
    }

    todos[index].completed = completed;
  }

  saveTodos(todos);

  return res.json(todos[index]);
});

// DELETE TODO
router.delete("/:id", (req, res) => {
  const todos = getTodos();

  const newTodos = todos.filter(
    (t) => t.id !== Number(req.params.id)
  );

  if (newTodos.length === todos.length) {
    return res.status(404).json({
      error: "Todo not found",
    });
  }

  saveTodos(newTodos);

  return res.json({
    success: true,
  });
});

module.exports = router;