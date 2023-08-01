<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="surface-variant" height="96">
      <v-container>
        <v-row align="center">
          <v-col>
            <h3 v-if="user">{{ `Heeey ${user?.displayName}!` }}</h3>
            <v-switch v-model="themeToggle" hide-details inset label="Theme"></v-switch>
          </v-col>
          <Login />
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px">
      <RouterView />
    </v-main>

    <v-footer class="coral" app> Your feedback is important! </v-footer>
  </v-layout>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'
import Login from '@components/LogIn.vue'

const theme = useTheme()
const themeToggle = ref(false)
const auth = getAuth()
const user = ref()

import { getAuth } from 'firebase/auth'
import { RouterView } from 'vue-router'
const handleAuthStateChanged = (firebaseUser) => {
  user.value = firebaseUser
}

// Watch for changes in authentication state
onMounted(() => {
  const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged)
  // To unsubscribe from the watcher when the component unmounts
  onBeforeUnmount(unsubscribe)
})
watch(themeToggle, (value) => (theme.global.name.value = value ? 'light' : 'dark'))
</script>
