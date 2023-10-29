<template>
  <v-row no-gutters>
    <v-col class="mx-4">
      <v-img
        aspect-ratio="16/9"
        cover
        :src="
          currentDish.photo ||
          'https://placehold.co/3840x2160.png?text=Good+Food'
        "
        class="text-right pa-2"
      >
        <v-btn
          class="favorite"
          :icon="currentDish.idFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
          @click="() => console.log('TODO: make is favorite')"
        ></v-btn
      ></v-img>
    </v-col>
    <v-col>
      <v-list-item-title class="text-h6 text-md-h5 text-lg-h4">
        {{ currentDish.name }}
      </v-list-item-title>
      <v-chip-group multiple selected-class="text-primary" v-model="selection">
        <v-chip v-for="filter in currentDish.filters" :key="filter">
          {{ filter }}
        </v-chip>
      </v-chip-group>
      <div class="d-flex py-3 justify-space-between">
        <v-list-item density="compact" prepend-icon="mdi-account-multiple">
          <v-list-item-subtitle>{{ currentDish.portion }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider vertical />
        <v-list-item density="compact" prepend-icon="mdi-clock-time-five">
          <v-list-item-subtitle>{{ currentDish.time }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider vertical />
        <v-list-item density="compact" prepend-icon="mdi-currency-usd">
          <v-list-item-subtitle>{{ currentDish.cost }}</v-list-item-subtitle>
        </v-list-item>
      </div>
      <v-list-item-subtitle> {{ currentDish.process }} </v-list-item-subtitle>
      <v-card-actions>
        <v-btn
          prepend-icon="mdi-pencil-outline"
          size="small"
          :to="`/dish/edit/${currentDish.ObjectId}`"
        >
          Edit
        </v-btn>
        <v-btn
          prepend-icon="mdi-delete"
          size="small"
          @click="() => deleteDish(currentDish.ObjectId)"
        >
          Delete
        </v-btn>
      </v-card-actions>

      {{ currentDish }}
    </v-col>
  </v-row>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDishStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const store = useDishStore()

const route = useRoute()
const { getDish } = store
const { currentDish } = storeToRefs(store)
const { deleteDish } = store

const dishId = route.params.dish
onMounted(async () => {
  if (dishId) {
    await getDish(route.params.dish)
  }
})
</script>
