<template>
  <v-container>
    <v-col cols="12" v-for="dish in dishes" :key="dish.id">
      <DishCard :details="dish" />
    </v-col>
    <v-btn block class="mb-8" color="blue" size="large" variant="tonal">
      <RouterLink :to="`/dish/`">Add another one!</RouterLink>
    </v-btn>
  </v-container>
</template>

<script setup>
import DishCard from '@components/DishCard.vue'
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
