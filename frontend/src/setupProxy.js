import { createProxyMiddleware } from 'http-proxy-middleware';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    })
  );

  app.use(
    '/ws',
    createProxyMiddleware({
      target: backendUrl.replace(/^http/, 'ws'), // Replace http with ws for websocket proxy
      ws: true,
      changeOrigin: true,
    })
  );
};
