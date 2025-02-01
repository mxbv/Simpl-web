import { createRouter, createWebHistory } from "vue-router";
import NoteDetails from "@/components/NoteDetail.vue"; // Компонент для детального просмотра заметки

// const routes = [
  
// ];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/note/:id",
      name: "NoteDetails",
      component: NoteDetails, // Компонент для отображения деталей заметки
    },
  ],
});

export default router;
