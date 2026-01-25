import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite';
import { syncVersion } from './build_scripts/syncVersion';

export default defineConfig(({ mode }) => {
  return {
    publicDir: false,
    appType: 'mpa',
    minify: false,
    plugins: [
      tailwindcss(),
      react(),
      tsconfigPaths(),
      viteStaticCopy({
        targets: [
          {
            src: 'assets/manifest.json',
            dest: '.',
            transform: (contents) => syncVersion(contents, mode),
          },
          { src: 'assets/icon/*', dest: 'icon' },
          { src: 'assets/favicon.ico.png', dest: '.' },
        ],
      }),
    ],
    build: {
      chunkSizeWarningLimit: 1000,
      outDir: 'build',
      rollupOptions: {
        input: {
          sidePanel: 'src/sidePanel/index.html',
          popup: 'src/popup/index.html',
          options: 'src/options/index.html',
        },
        output: {
          entryFileNames: (chunk) => `assets/${ chunk.name }-entry-[hash].js`,
          chunkFileNames: 'assets/chunk-[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  };
});
