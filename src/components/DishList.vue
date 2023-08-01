<template>
  <v-row>
    <v-col v-for="dish in dishes" :key="dish.id" cols="12">
      <DishCard :details="dish" />
    </v-col>
    <v-btn block class="mb-8" color="blue" size="large" variant="tonal" :to="`/dish/`">
      Add another one!
    </v-btn>
  </v-row>
</template>

<script setup>
import DishCard from './DishCard.vue'
import { db } from '@/firebase.js'
import { ref, onMounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'

const dishes = ref([])

onMounted(() => {
  onSnapshot(
    collection(db, 'dishes'),
    (querySnapshot) => {
      const arr = []
      console.log('querySnapshot: ', querySnapshot)
      querySnapshot.forEach((item) => {
        arr.push({ id: item.id, ...item.data() })
      })
      dishes.value = arr
    },
    (error) => {
      console.log('onSnapshotError: ', error)
    }
  )
})
</script>
