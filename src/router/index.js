import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      // component: HomeView,
      component: () => import('@views/HomeView.vue'),
    },
    {
      path: '/dishes',
      name: 'Dishes',
      redirect: { name: 'Home' },
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
      path: '/calendar',
      name: 'Calendar',
      component: () => import('@views/Calendar.vue'),
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: () => import('@views/Inventory.vue'),
    },
  ],
})

export default router
