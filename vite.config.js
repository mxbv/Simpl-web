import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src", // Указываем корневую папку
  build: {
    outDir: "../dist", // Папка для собранных файлов
    emptyOutDir: true, // Очищать папку перед сборкой
    assetsDir: "assets", // Папка для статических файлов
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"), // Главный HTML
      },
      output: {
        assetFileNames: "assets/[name].[hash].[ext]", // Имена статических файлов
        chunkFileNames: "assets/[name].[hash].js", // Имена чанков JS
        entryFileNames: "assets/[name].[hash].js", // Имена входных JS
      },
    },
  },
});
