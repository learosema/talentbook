// Utility script to serve the production build
const PORT = +process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(express.static('build'));
app.use(
  '/api',
  createProxyMiddleware({ target: 'http://localhost:1337', changeOrigin: true })
);

app.listen(PORT, HOST, () =>
  console.log(`Server listening af http://${HOST}:${PORT}/`)
);
