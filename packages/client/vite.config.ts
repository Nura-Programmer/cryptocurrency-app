import { defineConfig, loadEnv } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const {
    VITE_API_URL = "http://localhost:5000",
    VITE_CLIENT_PORT = 5000
  } = loadEnv(mode, process.cwd(), "");

  console.log(VITE_API_URL, VITE_CLIENT_PORT);

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: +VITE_CLIENT_PORT,
      proxy: {
        "/api": VITE_API_URL,
        "/socket.io": {
          target: VITE_API_URL,
          ws: true
        }
      }
    }
  }
});
