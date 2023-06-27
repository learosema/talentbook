// Utility script to serve the production build
const PORT = +process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';
const API_URL = process.env.API_URL || 'http://localhost:8001';
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(express.static('build'));
app.use(
  '/api',
  createProxyMiddleware({ target: API_URL, changeOrigin: true })
);

app.listen(PORT, HOST, () =>
  console.log(`Server listening af http://${HOST}:${PORT}/`)
);
