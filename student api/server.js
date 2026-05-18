    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    const app = express();

    app.set('json spaces', 2);
    
    // Middleware
    app.use(express.json());

    // Load students from JSON file
    function getStudents() {
    const filePath = path.join(__dirname, 'students.json');
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading students.json:', error.message);
        return [];
    }
    }

    // GET /students
    app.get('/students', (req, res) => {
    try {
        const students = getStudents();
        res.json(students);
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Error reading students file",
        error: error.message
        });
    }
    });

    // GET /student/:id
    app.get('/student/:id', (req, res) => {
    try {
        const students = getStudents();
        const studentId = parseInt(req.params.id);
        const student = students.find(s => s.id === studentId);
        
        if (student) {
        res.json(student);
        } else {
        res.status(404).json({
            message: "Student not found"
        });
        }
    } catch (error) {
        res.status(500).json({
        message: "Error reading students file",
        error: error.message
        });
    }
    });

    app.get('/', (req, res) => {
    res.json({
        message: "Student API is running!",
        endpoints: {
        "GET /student/:id": "Get a single student by ID",
        "GET /students": "Get all students",
        "POST /student": "Create a new student",
        "PUT /student/:id": "Update a student",
        "DELETE /student/:id": "Delete a student"
        }
    });
    });

    const PORT = 3000;
    app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
    console.log(`Open Postman and test the /student routes!`);
    console.log(`Reading from: students.json`);
    });
