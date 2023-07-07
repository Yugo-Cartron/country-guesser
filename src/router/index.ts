import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/components/Home.vue";
import Play from "@/components/Play.vue";
import Tutorial from "@/components/Tutorial.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/play',
      name: 'play',
      component: Play
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: Tutorial
    }
  ]
})

export default router
