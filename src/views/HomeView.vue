<template>
  <v-container fluid>
    <v-row>
      <ais-instant-search
        :search-client="searchClient"
        index-name="text"
        class="instant-search"
        :routing="routing"
      >
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
          @input="onInput"
        ></v-text-field>
        <v-list v-if="hits.length">
          <v-list-subheader
            v-for="item in hits"
            :key="item.name"
            inset
            @click="() => router.push(`/dish/${item.objectID}`)"
          >
            {{ item.name }}
          </v-list-subheader>
        </v-list>
      </ais-instant-search>
    </v-row>
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <span class="subheading">Quick filters</span>
        <v-chip-group
          multiple
          selected-class="text-primary"
          v-model="selection"
        >
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
import { ref, watch } from 'vue'
import { deepUnref } from 'vue-deepunref'
import Filters from '@components/FilterOptions.vue'
import DishList from '@components/DishList.vue'
import { useDishStore } from '@/store'
import algoliasearch from 'algoliasearch/lite'
import { history } from 'instantsearch.js/es/lib/routers'
import { singleIndex } from 'instantsearch.js/es/lib/stateMappings'
import router from '@/router'

const APP_ID = import.meta.env.VITE_APP_ID
const API_KEY = import.meta.env.VITE_API_KEY

const searchClient = algoliasearch(APP_ID, API_KEY)
const routing = {
  router: history(),
  stateMapping: singleIndex('text'),
}

const store = useDishStore()

const loading = ref(false)
const hits = ref([])

const index = searchClient.initIndex('text')

const onInput = async () => {
  loading.value = true
  try {
    const response = await index.search(searchText.value)
    hits.value = response.hits
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}
const selection = ref([])
const tags = ref([
  'spicy',
  'chicken',
  'vegatables',
  'quick',
  'breakfast',
  'dinner',
  'soup',
])
const searchText = ref('')
const { getDishes } = store
watch(selection, async (selection) => {
  const quickFilters = deepUnref(selection).map((item) => tags.value[item])
  getDishes({ quickFilters })
})

const search = () => {
  searchClient.$ais.currentRefinement = searchText
}
</script>

<style scoped>
.instant-search {
  width: 100%;
}
</style>
