#!/usr/bin/env node

import dotenv from 'dotenv';  // Load biến môi trường
import app from './app.js';  // Import app (đảm bảo app hỗ trợ ES Module)
import debug from 'debug';  // Debug
import http from 'http';  // HTTP

// Load biến môi trường
dotenv.config();

// Lấy port từ biến môi trường hoặc mặc định
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Tạo server.js
const server = http.createServer(app);

// Lắng nghe các sự kiện
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Chuẩn hóa port
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

// Xử lý lỗi server.js
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Khi server.js bắt đầu lắng nghe
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log(`Server đang chạy tại cổng ${port}`);
}
