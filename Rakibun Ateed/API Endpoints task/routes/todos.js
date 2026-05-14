const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const todosFile = path.join(__dirname, '../todos.json');

// Helper function to read todos from JSON file
function readTodos() {
  if (!fs.existsSync(todosFile)) {
    return [];
  }
  const data = fs.readFileSync(todosFile, 'utf8');
  return JSON.parse(data);
}

// Helper function to write todos to JSON file
function writeTodos(todos) {
  fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
}

// GET /todos - Get all todos or filter by query
router.get('/', (req, res) => {
  let todos = readTodos();
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === 'true';
    todos = todos.filter(todo => todo.completed === completed);
  }
  res.json(todos);
});

// GET /todos/:id - Get a single todo by ID
router.get('/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.json(todo);
});

// POST /todos - Create a new todo
router.post('/', (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    title: req.body.title,
    description: req.body.description || '',
    completed: req.body.completed || false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT /todos/:id - Update a todo
router.put('/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(t => t.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  todos[index] = { ...todos[index], ...req.body };
  writeTodos(todos);
  res.json(todos[index]);
});

// DELETE /todos/:id - Delete a todo
router.delete('/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(t => t.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  const deletedTodo = todos.splice(index, 1)[0];
  writeTodos(todos);
  res.json(deletedTodo);
});

module.exports = router;