<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar height="96" v-if="windowWidth < 1024">
      <v-container>
        <v-row align="center">
          <v-col>
            <h3 v-if="currentUser">
              {{ `Heeey ${currentUser?.displayName || ''}!` }}
            </h3>
            <v-switch
              v-model="themeToggle"
              hide-details
              inset
              label="Theme"
            ></v-switch>
          </v-col>
          <Login />
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- <SideBar v-if="windowWidth >= 1024" /> -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      v-if="windowWidth >= 1024"
    >
      <v-list-item
        :prepend-avatar="`https://placehold.co/40x40?text=${
          currentUser?.displayName || 'U'
        }`"
        :title="`Heeey ${currentUser?.displayName || ''}!`"
        nav
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="m in menu"
          :key="m.id"
          :title="m.name"
          :value="m.id"
          :prepend-icon="m.icon"
          @click="router.push('/' + m.id)"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="flex align-center justify-center">
      <!-- <KeepAlive>
        <RouterView />
      </KeepAlive> -->
      <router-view v-slot="{ Component }">
        <keep-alive include="Calendar,HomeView">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <SnackBar />
    </v-main>

    <v-bottom-navigation v-if="windowWidth < 1024">
      <v-btn
        v-for="m in menu"
        :key="m.id"
        :value="m.id"
        @click="router.push('/' + m.id)"
      >
        <v-icon>{{ m.icon }}</v-icon>

        <span>{{ m.name }}</span>
      </v-btn>
    </v-bottom-navigation>
    <v-footer class="coral" app> Your feedback is important! </v-footer>
  </v-layout>
</template>

<script setup>
import { ref, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'
import { RouterView, useRouter } from 'vue-router'
import Login from '@components/LogIn.vue'
import SnackBar from '@components/SnackBar.vue'
// import SideBar from '@components/SideBar.vue'
import { useAuthStore } from '@store'
import { storeToRefs } from 'pinia'
import { useDishStore } from '@store'
const router = useRouter()

const theme = useTheme()
const drawer = ref(true)
const rail = ref(true)
const themeToggle = ref(false)
const windowWidth = ref(window.innerWidth)
const menu = ref([
  { id: 'dishes', name: 'Dishes', icon: 'mdi-receipt-text' },
  { id: 'calendar', name: 'Calendar', icon: 'mdi-calendar-month' },
  { id: 'inventory', name: 'Inventory', icon: 'mdi-format-list-checks' },
])

const { currentUser } = storeToRefs(useAuthStore())

const dishStore = useDishStore()
const authStore = useAuthStore()

watch(
  themeToggle,
  (value) => (theme.global.name.value = value ? 'light' : 'dark')
)
// TODO: change this to use Vuetify v-resize
const onResize = () => {
  windowWidth.value = window.innerWidth
}

onBeforeMount(async () => {
  await authStore.setup()
  await dishStore.setup()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>
