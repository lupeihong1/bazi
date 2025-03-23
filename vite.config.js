import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 将基础路径设置为相对路径
  plugins: [vue()],
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: '', // 将资源直接放在根目录
    cssCodeSplit: false, // 禁用CSS代码分割
    rollupOptions: {
      output: {
        manualChunks: undefined, // 禁用代码分割
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
