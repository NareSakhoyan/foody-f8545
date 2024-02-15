import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/HomeView.vue'
import { useAuthStore, useAppStore } from '@store/app'
import { useModal } from '@src/plugins/ModalPlugin.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/dishes',
      name: 'Dishes',
      redirect: { name: 'Home' },
      meta: { requiresAuth: true },
    },
    {
      path: '/dish/:dish?',
      name: 'View Dish',
      component: () => import('@views/DishView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dish/edit/:dish?',
      name: 'Edit Dish',
      component: () => import('@components/EditDish.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('@views/Calendar.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: () => import('@views/Inventory.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  if (to.meta.requiresAuth) {
    if (authStore.user) {
      // User is authenticated, allow access
      next()
    } else {
      // User is not authenticated, open login popup
      // TODO: next('/login')
      // await authStore.setup()
      if (appStore.loading != true) {
        const $modal = useModal()
        $modal.value.loginPopup = true
      }
      // TODO maybe subsccribe to authStore.user?
    }
  }
  next()
})

export default router
