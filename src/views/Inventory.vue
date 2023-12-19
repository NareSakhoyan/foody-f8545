<template>
  <v-container>
    <h5 class="text-h5 align-self-center pb-4">Home inventory</h5>
    <v-card>
      <v-tabs v-model="tab" bg-color="primary" align-tabs="center">
        <v-tab :value="tabInfo.id" v-for="tabInfo in tabs" :key="tabInfo.id">
          {{ tabInfo.name }}</v-tab
        >
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item :value="tabInfo.id" v-for="tabInfo in tabs" :key="tabInfo.id">
            <component :is="tabInfo.component" :data="tabInfo.data()" />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useIngredientsStore } from '@store/ingredients'
import IngredientsList from '@components/ingredients/IngredientsList.vue'
// import IngredientsChecklist from '@components/ingredients/IngredientsChecklist.vue'

const ingredientsStore = useIngredientsStore()
onBeforeMount(() => {
  ingredientsStore.setup()
})
const { allIngredients } = storeToRefs(ingredientsStore)
const tab = ref()
const tabs = [
  // {
  //   name: 'I have',
  //   id: 'have',
  //   data: () => allIngredients.value.filter((ingr) => ingr.available),
  //   component: IngredientsChecklist,
  // },
  // {
  //   name: 'Need to buy',
  //   id: 'need',
  //   data: () => allIngredients.value,
  //   component: IngredientsList,
  // },
  {
    name: 'All',
    id: 'all',
    data: () => allIngredients.value,
    component: IngredientsList,
  },
]
</script>
