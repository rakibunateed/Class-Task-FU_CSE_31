const express = require('express');
const app = express();

app.use(express.json());

const todoRoutes = require('./routes/todos');
app.use('/todos', todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.
Visit http://localhost:${PORT}/todos to manage your to-do list.`));