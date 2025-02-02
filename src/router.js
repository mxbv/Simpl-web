import { createRouter, createWebHistory } from "vue-router";
import NoteDetails from "@/components/NoteDetail.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/note/:id",
      name: "NoteDetails",
      component: NoteDetails,
    },
  ],
});

export default router;
