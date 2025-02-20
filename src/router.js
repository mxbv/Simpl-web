import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory("/#/"),
  routes: [
    {
      path: "/note/:id",
      name: "Note Details",
      component: () => import("@/views/NoteDetail.vue"),
    },
  ],
});

export default router;
