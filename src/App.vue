<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar height="96">
      <v-container>
        <v-row align="center">
          <v-col>
            <h3 v-if="currentUser">{{ `Heeey ${currentUser?.displayName}!` }}</h3>
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

    <v-main class="flex align-center justify-center">
      <RouterView />
      <SnackBar />
    </v-main>

    <v-footer class="coral" app> Your feedback is important! </v-footer>
  </v-layout>
</template>

<script setup>
import { ref, watch, } from 'vue'
import { useTheme } from 'vuetify'
import { RouterView } from 'vue-router'
import Login from '@components/LogIn.vue'
import SnackBar from '@components/SnackBar.vue'
import { useAuthStore } from '@/store'
import { storeToRefs } from 'pinia'

const theme = useTheme()
const themeToggle = ref(false)

const { currentUser } = storeToRefs(useAuthStore())


watch(
  themeToggle,
  (value) => (theme.global.name.value = value ? 'light' : 'dark')
)
</script>
