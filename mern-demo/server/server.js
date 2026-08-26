const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const Student = require('../models/Student');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
mongoose.set('bufferCommands', false);

// Kết nối MongoDB Atlas bằng Mongoose
if (!MONGODB_URI) {
  console.error('>> Thiếu MONGODB_URI. Kiểm tra file .env trong mern-demo/server.');
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('>> Đã kết nối MongoDB Atlas thành công!');
    app.listen(PORT, () => {
      console.log(`Server Node.js đang chạy trên port: ${PORT}`);
    });
  } catch (err) {
    console.error('>> Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  }
}

// API Test
app.get('/api/hello', (req, res) => {
	res.json({ message: 'Backend đang hoạt động và đã kết nối MongoDB Atlas!' });
});

startServer();

//CÂU 36
// Câu 36: Gợi ý sử dụng Student.find() để lấy toàn bộ sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//CÂU 37
// Câu 37: Gợi ý sử dụng Student.create() và req.body để thêm mới sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//CÂU 38
// Câu 38: Gợi ý sử dụng Student.findByIdAndUpdate() để sửa thông tin sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//CÂU 39
// Câu 39: Gợi ý sử dụng Student.findByIdAndDelete() để xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Xóa sinh viên thành công!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});