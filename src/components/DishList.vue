<template>
  <v-contianer>
    <v-row justify="start">
      <v-col v-for="dish in dishes" :key="dish.id" xs="12" sm="6" lg="4">
        <DishCard :details="dish" />
      </v-col>
    </v-row>
    <v-btn
      block
      class="mb-8"
      color="blue"
      size="large"
      variant="tonal"
      :to="`/dish/edit`"
    >
      Add another one!
    </v-btn>
  </v-contianer>
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
