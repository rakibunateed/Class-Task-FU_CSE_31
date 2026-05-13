const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Khadija Student API Server');
});

app.get('/api/v1/student-profile', (req, res) => {
    const studentProfile = {
        status: "success",
        timestamp: new Date(),
        student: {
            studentId: "232031042",
            fullName: "Khadija Akter Sumi",
            department: "Computer Science and Engineering",
            university: "Feni University",
            semester: "6th",
            skills: ["JavaScript", "C", "HTML"]
        }
    };

    res.status(200).json(studentProfile);
});


app.get('/api/v1/status', (req, res) => {
    res.json({
        server: "running",
        port: PORT
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
