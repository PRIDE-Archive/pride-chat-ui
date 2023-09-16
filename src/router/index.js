import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Chat.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("../views/Chat.vue"),
  },
  {
    path: "/resource",
    name: "resource",
    component: () => import("../views/Resource.vue"),
  },
  {
    path: "/relevant",
    name: "relevant",
    component: () => import("../views/Relevant.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
