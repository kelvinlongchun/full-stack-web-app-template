import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import AccountView from "@/views/user/AccountView.vue";
import ActivateView from "@/views/user/activate/ActivateView.vue";
import ResetPasswordView from "@/views/user/reset-password/ResetPasswordView.vue";
import ForgotPasswordView from "@/views/user/forgot-password/ForgotPasswordView.vue";
import AuthView from "@/views/auth/AuthView.vue";
import NotFoundView from "@/views/error/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/user",
      name: "account",
      component: AccountView,
    },
    {
      path: "/user/activate",
      name: "activate",
      component: ActivateView,
    },
    {
      path: "/user/reset-password",
      name: "reset-password",
      component: ResetPasswordView,
      props: (route) => ({ query: route.query }),
    },
    {
      path: "/user/forgot-password",
      name: "forgot-password",
      component: ForgotPasswordView,
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthView,
      props: (route) => ({ query: route.query }),
    },
    {
      path: "/error",
      name: "not-found",
      component: NotFoundView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
    },
  ],
});

export default router;
