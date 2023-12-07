<template>
  <v-container>
    <v-row>
      <v-col xs="12" md="6">
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
            :icon="currentDish.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
            @click="
              () =>
                updateDishField(currentDish.id, {
                  isFavorite: !currentDish.isFavorite,
                })
            "
          ></v-btn
        ></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list-item-title class="text-h6 text-md-h5 text-lg-h4">
          {{ currentDish.name }}
        </v-list-item-title>
        <v-chip-group
          multiple
          selected-class="text-primary"
          v-model="selection"
        >
          <v-chip v-for="filter in currentDish.filters" :key="filter">
            {{ filter }}
          </v-chip>
        </v-chip-group>
        <div class="d-flex py-3 justify-space-between">
          <v-list-item density="compact" prepend-icon="mdi-account-multiple">
            <v-list-item-subtitle>{{
              currentDish.portion
            }}</v-list-item-subtitle>
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

        <v-chip-group
          multiple
          selected-class="text-primary"
          v-model="selection"
        >
          <v-chip v-for="ingr in currentDish.ingredients" :key="ingr.title">
            {{
              `${ingr.amount ? ingr.amount + ingr.unitName || '' : ''} ` +
              ingr.title
            }}
          </v-chip>
        </v-chip-group>
        <v-list-item-subtitle> {{ currentDish.process }} </v-list-item-subtitle>
        <v-card-actions>
          <v-btn
            prepend-icon="mdi-pencil-outline"
            size="small"
            :to="`/dish/edit/${currentDish.id}`"
          >
            Edit
          </v-btn>
          <v-btn
            prepend-icon="mdi-delete"
            size="small"
            @click="
              () => {
                deleteDish(currentDish.id)
                router.push('/')
              }
            "
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDishStore } from '@store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const store = useDishStore()

const route = useRoute()
const { getDish, updateDishField } = store
const { currentDish } = storeToRefs(store)
const { deleteDish } = store

const dishId = route.params.dish
onMounted(async () => {
  if (dishId) {
    await getDish(route.params.dish)
  }
})
</script>
