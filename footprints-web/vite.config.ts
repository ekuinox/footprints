import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  root: './',
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '#/': path.join(__dirname, './src/'),
    },
  },
});
