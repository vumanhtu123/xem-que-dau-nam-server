import dotenv from 'dotenv'; // Load biến môi trường từ .env
import express from 'express';  // Import Express
import logger from 'morgan'; // Ghi log các request
import fortuneRouter from './routes/fortune.js'; // Import route

dotenv.config(); // Load biến môi trường
const app = express();

// Middleware
app.use(logger('dev')); // Sử dụng logger
app.use(express.json()); // Đọc dữ liệu JSON
app.use(express.urlencoded({ extended: false })); // Đọc dữ liệu URL-encoded

// Routes
app.use('/api/fortune', fortuneRouter); // Gắn route xem quẻ đầu năm

// Xử lý lỗi
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});

export default app; // Export app với cú pháp ES Module
