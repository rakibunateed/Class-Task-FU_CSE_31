const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.set(`json spaces`, 2);
// Middleware
app.use(express.json());


// Load todos from JSON file
function getTodos() {
  const filePath = path.join(__dirname, 'todo.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading todos.json:', error.message);
    return [];
  }
}

// Save todos to JSON file
function saveTodos(todos) {
  const filePath = path.join(__dirname, 'todos.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error('Error saving todos.json:', error.message);
  }
}

// 1. GET /todos - Get all todos
app.get('/todos', (req, res) => {
  try {
    let todos = getTodos();
    
    // Query parameters
    const { startId, endId } = req.query;
    
    // Range filtering by ID
    if (startId !== undefined || endId !== undefined) {
      const start = startId ? parseInt(startId) : 1;
      const end = endId ? parseInt(endId) : 999;
      
      todos = todos.filter(t => t.id >= start && t.id <= end);
    }
    
    res.json(todos);
  } catch (error) {
    res.status(500).json({
      message: "Error reading todos file",
      error: error.message
    });
  }
});

// 2. GET /todos/:id - Get a single todo by ID
app.get('/todos/:id', (req, res) => {
  try {
    const todos = getTodos();
    const todoId = parseInt(req.params.id);
    const todo = todos.find(t => t.id === todoId);
    
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({
        message: "Todo not found"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error reading todos file",
      error: error.message
    });
  }
});

// 3. POST /todos - Create a new todo
app.post('/todos', (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    // Validation
    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }
    
    const todos = getTodos();
    
    // Generate new ID (get max ID and add 1)
    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    
    const newTodo = {
      id: newId,
      title,
      description: description || "",
      completed: completed || false,
      createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveTodos(todos);
    
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({
      message: "Error creating todo",
      error: error.message
    });
  }
});

// 4. PUT /todos/:id - Update a todo
app.put('/todos/:id', (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const { title, description, completed } = req.body;
    
    const todos = getTodos();
    const todo = todos.find(t => t.id === todoId);
    
    if (!todo) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }
    
    // Update fields if provided
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    
    todo.updatedAt = new Date().toISOString();
    
    saveTodos(todos);
    
    res.json({
      message: "Todo updated successfully",
      updatedTodo: todo
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating todo",
      error: error.message
    });
  }
});

// 5. DELETE /todos/:id - Delete a todo
app.delete('/todos/:id', (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todos = getTodos();
    const index = todos.findIndex(t => t.id === todoId);
    
    if (index === -1) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }
    
    const deletedTodo = todos.splice(index, 1);
    saveTodos(todos);
    
    res.json({
      message: "Todo deleted successfully",
      deletedTodo: deletedTodo[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting todo",
      error: error.message
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "Todo API is running!",
    endpoints: {
      "GET /todos": "Get all todos",
      "GET /todos/:id": "Get a single todo",
      "POST /todos": "Create a new todo",
      "PUT /todos/:id": "Update a todo",
      "DELETE /todos/:id": "Delete a todo"
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Todo API running on http://localhost:${PORT}`);
}); 
