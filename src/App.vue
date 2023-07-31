<template>
  <!-- <header>

    <div class="wrapper">
      <Dish />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      
    </div>
  </header> -->

  <v-app>
    <v-row align="center">
      <v-switch
        v-model="themeToggle"
        hide-details
        inset
        label="Theme"
        class="custom-v-switch"
      ></v-switch>
      <v-btn append-icon="mdi-account-circle">
        <RouterLink to="/login">Log in</RouterLink>

        <!-- <template v-slot:append>
          <v-icon color="warning"></v-icon>
        </template> -->
      </v-btn>
    </v-row>
    <RouterView />
  </v-app>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'

import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'
const theme = useTheme()
const themeToggle = ref(false)

watch(themeToggle, (value) => (theme.global.name.value = value ? 'light' : 'dark'))
</script>

<style>
#app {
  margin-top: 2rem;
}
</style>
