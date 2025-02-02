import { createRouter, createWebHashHistory } from "vue-router";
import NoteDetails from "@/components/NoteDetail.vue";

const router = createRouter({
  history: createWebHashHistory("/#/"),
  routes: [
    {
      path: "/note/:id",
      name: "NoteDetails",
      component: NoteDetails,
    },
  ],
});

export default router;
