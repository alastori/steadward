import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __EDITION__: JSON.stringify(process.env.EDITION || 'demo'),
  },
});
