import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/dish/:dish?',
      name: 'View Dish',
      component: () => import('@views/DishView.vue'),
    },
    {
      path: '/dish/edit/:dish?',
      name: 'Edit Dish',
      component: () => import('@components/EditDish.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@views/AboutView.vue'),
    },
  ],
})

export default router
