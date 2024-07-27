import dotenv, { parse } from 'dotenv';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { CodeInspectorPlugin } from 'code-inspector-plugin';

dotenv.config();

const backEndPort = parseInt(process.env.BACKEND_PORT || 11966, 10);
const frontEndPort = parseInt(process.env.FRONTEND_PORT || 18966, 10);

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'pwa-install'
        }
      }
    }),
    CodeInspectorPlugin({
      bundler: 'vite',
      hideDomPathAttr: true,
      behavior: {
        copy: '{file}',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/frontend',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.woff') || assetInfo.name.endsWith('.woff2')) {
            return 'fonts/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: '0.0.0.0',
    port: frontEndPort,
    proxy: {
      '/api': `http://localhost:${backEndPort}`
    }
  }
})
