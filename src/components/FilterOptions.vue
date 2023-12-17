<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="start">
      <template #activator="{ props }">
        <v-btn class="ma-2" v-bind="props">
          <v-icon start icon="mdi-filter"></v-icon>
          Filters
        </v-btn>
      </template>
      <v-form ref="form">
        <v-card min-width="300">
          <v-divider></v-divider>

          <v-list class="filters-list">
            <v-list-item title="Ingredients">
              <v-combobox
                v-model="ingredients"
                v-model:search="searchIngredient"
                :hide-no-data="false"
                :items="allIngredients"
                hide-selected
                label="Ingredients"
                multiple
                small-chips
                item-text="title"
                item-value="title"
              />
            </v-list-item>
            <v-list-item class="list-item-overflow-visible" title="Cost">
              <v-range-slider
                v-model="cost"
                step="500"
                max="15000"
                thumb-label="always"
                class="slider"
              ></v-range-slider>
            </v-list-item>
            <v-list-item class="list-item-overflow-visible" title="Time">
              <v-slider
                v-model="time"
                :color="color"
                track-color="grey"
                max="120"
                step="5"
                show-ticks
                tick-size="2"
                thumb-label="always"
              >
                <template #thumb-label="{ modelValue }"> {{ modelValue }} mnts </template>
              </v-slider>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn variant="text" @click="menu = false"> Cancel </v-btn>
            <v-btn
              color="secondary"
              variant="text"
              @click="
                () => {
                  menu = false
                  applyFilters()
                }
              "
            >
              Load
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-menu>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { deepUnref } from 'vue-deepunref'
import { useDishStore } from '@store'

const store = useDishStore()
const { getDishes } = store
const { allIngredients } = storeToRefs(store)

const form = ref()
const ingredients = ref([])
const menu = ref(false)
const cost = ref([0, 15000])
const time = ref(0)

const color = computed(() => {
  if (time.value <= 15) return 'green'
  if (time.value <= 30) return 'teal'
  if (time.value <= 45) return 'blue'
  if (time.value <= 60) return 'lime'
  if (time.value <= 100) return 'orange'
  return 'red'
})

const applyFilters = () => {
  const filters = {
    ingredients: deepUnref(ingredients),
    time,
    cost: deepUnref(cost),
  }
  getDishes(deepUnref(filters))
}
</script>

<style>
.list-item-overflow-visible .v-list-item__content {
  overflow: visible;
  .v-slider__container {
    margin-top: 1.25rem;
  }
  .v-slider-thumb__label {
    white-space: nowrap;
  }
}
.filters-list {
  overflow: hidden;
}
.filters-list .v-list-item-title {
  margin-bottom: 1rem;
}
</style>
