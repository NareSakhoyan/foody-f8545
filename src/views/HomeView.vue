<template>
  <v-container fluid>
    <v-row>
      <v-text-field
        :loading="loading"
        density="compact"
        variant="solo"
        label="Search templates"
        append-inner-icon="mdi-magnify"
        v-model="searchText"
        single-line
        hide-details
        @click:append-inner="search"
      ></v-text-field>
    </v-row>
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <span class="subheading">Quick filters</span>
        <v-chip-group multiple selected-class="text-primary">
          <v-chip v-for="tag in tags" :key="tag">
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <Filters />
    </v-row>
    <DishList />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Filters from '@components/FilterOptions.vue'
import DishList from '@components/DishList.vue'

const loading = ref(false)
const tags = ref(['spicy', 'chicken', 'vegatables', 'quick', 'breakfast', 'dinner'])
const searchText = ref('')

const search = () => {
  // TODO search functinoality
  console.log('Searching: ', searchText)
}
</script>
