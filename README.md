# 🎓 Student Profile API

## 📌 Overview
This project is developed as part of the IT Project Management course.  
It demonstrates how to build a simple REST API using Node.js and Express.js.

---

## 🚀 Features
- Custom API route for student profile
- JSON formatted response
- Additional status route
- Tested using Postman

---

## 🔗 API Endpoints

### 1. Get Student Profile
GET /api/v1/student-profile

### 2. Server Status
GET /api/v1/status

---

## 📊 Sample Response

```json
{
  "status": "success",
  "student": {
    "studentId": "232031042",
    "fullName": "Khadija Akter Sumi"
  }
}
