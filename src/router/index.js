import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("../views/Chat.vue"),
  },
  {
    path: "/benchmark",
    name: "benchmark",
    component: () => import("../views/Benchmark.vue"),
  },
  {
    path: "/resource",
    name: "resource",
    meta: { auth: true },
    component: () => import("../views/Database.vue"),
  },
  {
    path: "/visualize",
    name: "visualize",
    meta: { auth: true },
    component: () => import("../views/Visualize.vue"),
  },
  {
    path: "/relevant",
    name: "relevant",
    component: () => import("../views/Relevant.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const isAuthenticated = () => {
  let userName = localStorage.getItem("userName");
  return !!userName;
};

router.beforeEach((to, from, next) => {
  // ...
  console.log("to:", to);
  if (to.meta.auth && !isAuthenticated()) {
    next({ name: "login" });
  } else next();
});

export default router;
