import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory("/#/"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/note/:id",
      name: "Note Details",
      component: () => import("@/views/NoteView.vue"),
    },
  ],
});

export default router;
