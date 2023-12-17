<template>
  <v-row justify="start">
    <v-col v-for="dish in dishes" :key="dish.id" xs="12" sm="6" lg="4">
      <DishCard :details="dish" />
    </v-col>
    <v-col v-if="!dishes.length" class="text-center mb-2"> Umm sorry couldn't find any data </v-col>
  </v-row>
  <v-btn block class="my-8" color="teal" size="large" variant="tonal" :to="`/dish/edit`">
    Add another one!
  </v-btn>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDishStore } from '@store/dish'
import { storeToRefs } from 'pinia'
import DishCard from './DishCard.vue'

const store = useDishStore()
const { dishes } = storeToRefs(store)
const { setup } = store

onMounted(() => {
  setup()
})
</script>
