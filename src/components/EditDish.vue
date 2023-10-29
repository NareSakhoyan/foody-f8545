<template>
  <v-container>
    <v-form ref="form">
      <v-img
        v-if="photo || currentDish.photo"
        class="mx-auto"
        height="300"
        lazy-src="https://placehold.co/3840x2160.png?text=Good+Food"
        max-width="500"
        :src="downloadURL"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="grey-lighten-4"
              indeterminate
            ></v-progress-circular>
          </div>
        </template>
      </v-img>
      <v-file-input
        label="Photo"
        v-model="photo"
        prepend-icon="mdi-camera"
        @change="photoInput"
      />
      <v-text-field
        label="What's the name?"
        v-model="currentDish.name"
        placeholder="Yummy"
        :rules="rules.name"
      />
      <v-text-field
        label="For how many people?"
        v-model="currentDish.portion"
        :rules="rules.portion"
        suffix="people"
      />
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
        :rules="rules.ingredients"
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              <strong>{{ searchIngredient }}</strong> Press <kbd>enter</kbd> to
              create a new one
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-combobox>
      <v-list v-if="ingredients.length" class="ingredientsList">
        <v-list-item v-for="(ingr, index) in ingredients" :key="ingr">
          <v-row>
            <v-col cols="xs-12 sm-4">
              <v-list-subheader>{{ ingr.title }}</v-list-subheader>
            </v-col>
            <v-col cols="xs-6 sm-4">
              <v-text-field
                label="Amount"
                :model-value="ingr.amount"
                :suffix="ingr.unitName"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="xs-6 sm-4">
              <v-select
                :items="unitNames"
                density="compact"
                label="unit"
                @update:modelValue="(value) => (ingr.unitName = value)"
              ></v-select>
            </v-col>
          </v-row>
          <v-divider v-if="ingredients.length - 1 != index" />
        </v-list-item>
      </v-list>
      <v-combobox
        v-model="currentDish.filters.value"
        v-model:search="searchfilter"
        :hide-no-data="false"
        :items="quickFilters"
        hide-selected
        label="Filters"
        multiple
        small-chips
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              <strong>{{ searchfilter }}</strong> Press <kbd>enter</kbd> to
              create a new one
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-combobox>
      <v-text-field
        label="How much time is it gonna take?"
        v-model="currentDish.time"
        suffix="minutes"
      />
      <v-text-field
        label="How much does it cost?"
        v-model="currentDish.cost"
        prefix="֏"
      />
      <v-textarea label="Notes?" v-model="currentDish.process"></v-textarea>
      <v-row>
        <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          @click="saveDish"
        >
          That's it
        </v-btn>

        <v-btn
          class="mb-8"
          size="large"
          v-if="!editPageId"
          @click="
            () => {
              saveDish()
              resetValues()
            }
          "
        >
          Save and add another!
        </v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
// show the data https://vuetifyjs.com/en/components/data-tables/slots/#group-header-slot

import { ref, onMounted, watch } from 'vue'
import { deepUnref } from 'vue-deepunref'
import { useDishStore, useAuthStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const store = useDishStore()
const { getDish, addDish, updateDish, uploadPhoto } = store
const { currentDish, allIngredients } = storeToRefs(store)

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Load ingredients from a data store.
const unitNames = ref(['gr', 'kg', 'piece', 'box', 'l', 'ml', 'tbsp', 'tsp'])
const quickFilters = ref([
  'spicy',
  'chicken',
  'vegatables',
  'quick',
  'breakfast',
  'dinner',
  'soup',
])

const ingredients = ref([])
const searchIngredient = ref('')
const searchfilter = ref('')
const editPageId = route.params.dish
const photo = ref('')
const downloadURL = ref('')

onMounted(async () => {
  if (editPageId) {
    await getDish(route.params.dish)
    downloadURL.value = currentDish.value.photo
    ingredients.value = currentDish.value.ingredients
  }
})

const saveDish = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  currentDish.value.user = user.value.uid
  currentDish.value.photo = downloadURL.value
  currentDish.value.ingredients = ingredients
  if (editPageId) {
    await updateDish(editPageId, deepUnref(currentDish))
  } else {
    await addDish(deepUnref(currentDish))
  }
  store.$reset()
  router.push('/')
}

const photoInput = async () => {
  if (!photo?.value[0]) return null
  downloadURL.value = await uploadPhoto(photo?.value[0])
}

// When an ingredient is added, its value is changed to an object containing the amount and unit name properties.
watch(ingredients, (value, oldValue) => {
  console.log(value, oldValue)
  if (value.length < oldValue.length) return
  const lastItem = value[value.length - 1]
  if (
    typeof lastItem === 'string' &&
    lastItem?.trim() &&
    !ingredients.value.find((item) => item.title == lastItem)
  ) {
    ingredients.value.splice(-1, 1, {
      title: lastItem,
      amount: 1,
      unitName: '',
    })
  }
  console.log(
    22222,
    'cahnged ingredients: ',
    typeof lastItem,
    ingredients.value
  )
})

// Form validation
const form = ref()
const rules = {
  name: [
    (value) => {
      if (value?.length > 3) return true
      return 'I need the name'
    },
  ],
  portion: [
    (value) => {
      if (value && parseInt(value) > 0) return true
      return "It's gonna be for at least one person, isn't it?"
    },
  ],
  ingredients: [
    (value) => {
      if (value?.length > 2) return true
      return "Come on, tell me your secrets, less than 3 doesn't count"
    },
  ],
}
</script>

<style>
.ingredientsList {
  margin-bottom: 1.25rem;
}
</style>
