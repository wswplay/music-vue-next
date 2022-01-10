import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    component: () =>
      import(/* webpackChunkName: "recommend" */ "@/views/recommend"),
    children: [
      {
        path: ":id",
        component: () =>
          import(/* webpackChunkName: "album" */ "@/views/album"),
      },
    ],
  },
  {
    path: "/search",
    component: () => import(/* webpackChunkName: "search" */ "@/views/search"),
    children: [
      {
        path: ":id",
        component: () =>
          import(
            /* webpackChunkName: "singer-detail" */ "@/views/singer-detail"
          ),
      },
    ],
  },
  {
    path: "/singer",
    component: () => import(/* webpackChunkName: "singer" */ "@/views/singer"),
    children: [
      {
        path: ":id",
        component: () =>
          import(
            /* webpackChunkName: "singer-detail" */ "@/views/singer-detail"
          ),
      },
    ],
  },
  {
    path: "/top-list",
    component: () =>
      import(/* webpackChunkName: "top-list" */ "@/views/top-list"),
    children: [
      {
        path: ":id",
        component: () =>
          import(/* webpackChunkName: "top-detail" */ "@/views/top-detail"),
      },
    ],
  },
  {
    path: "/user",
    component: () =>
      import(/* webpackChunkName: "user-center" */ "@/views/user-center"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
