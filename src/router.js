import { createRouter, createWebHistory } from "vue-router";
import NoteItem from "./components/NoteItem.vue"; // Компонент для отображения полной заметки

export default createRouter({
  history: createWebHistory(),
  routes: [{ path: "/note", component: NoteItem }],
});
