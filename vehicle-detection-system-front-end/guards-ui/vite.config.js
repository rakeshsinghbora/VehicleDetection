import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', // Fix for sockjs-client error
  },
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:8080', // Your Spring Boot backend URL
        ws: true, // Enable WebSocket proxying
        changeOrigin: true, // Ensures the origin header is correctly set
      },
    },
  },
});
