<template>
  <v-row>
    <v-col v-for="dish in dishes" :key="dish.id" cols="12">
      <DishCard :details="dish" />
    </v-col>
    <v-btn
      block
      class="mb-8"
      color="blue"
      size="large"
      variant="tonal"
      :to="`/dish/`"
    >
      Add another one!
    </v-btn>
  </v-row>
</template>

<script setup>
import DishCard from './DishCard.vue'
import { onMounted } from 'vue'
import { useDishStore } from '@/store'
import { storeToRefs } from 'pinia'
const store = useDishStore()
const { dishes } = storeToRefs(store)
const { setup } = store

onMounted(() => {
  setup()
})
</script>
