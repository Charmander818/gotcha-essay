import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // On Vercel, environment variables are in process.env. 
  // In local dev, they might be in .env files loaded by loadEnv.
  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Shims process.env.GEMINI_API_KEY so the existing code works without modification
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
    }
  };
});