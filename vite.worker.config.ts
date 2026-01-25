import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    rollupOptions: {
      input: {
        service_worker: 'src/background/service_worker.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
        },
      },
    },
    sourcemap: false,
    outDir: 'build',
    emptyOutDir: false,
  },
});
