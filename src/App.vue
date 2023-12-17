<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar v-if="windowWidth < 1024" height="96">
      <v-container>
        <v-row align="center">
          <v-col>
            <h3 v-if="currentUser">
              {{ `Heeey ${currentUser?.displayName || ''}!` }}
            </h3>
            <v-switch v-model="themeToggle" hide-details inset label="Theme"></v-switch>
          </v-col>
          <Login />
        </v-row>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
      v-if="windowWidth >= 1024"
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
        :prepend-avatar="`https://placehold.co/40x40?text=${currentUser?.displayName || 'U'}`"
        :title="`Heeey ${currentUser?.displayName || ''}!`"
        nav
      >
        <template #append>
          <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
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

    <v-main class="flex align-center justify-center" v-if="!loading">
      <router-view v-slot="{ Component }">
        <keep-alive include="Calendar,HomeView">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <SnackBar />
    </v-main>
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-bottom-navigation v-if="windowWidth < 1024">
      <v-btn v-for="m in menu" :key="m.id" :value="m.id" @click="router.push('/' + m.id)">
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
import { useAuthStore, useAppStore } from '@store/app'
import { useDishStore } from '@store/dish'
import { storeToRefs } from 'pinia'

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

const dishStore = useDishStore()
const authStore = useAuthStore()
const appStore = useAppStore()

const { currentUser } = storeToRefs(authStore)
const { loading } = storeToRefs(appStore)

watch(themeToggle, (value) => (theme.global.name.value = value ? 'light' : 'dark'))
// TODO: change this to use Vuetify v-resize
const onResize = () => {
  windowWidth.value = window.innerWidth
}

onBeforeMount(async () => {
  await authStore.setup()
  authStore.$subscribe(async (newState) => {
    if (newState.user != null) await dishStore.setup()
  })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>
