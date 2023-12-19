<template>
  <!-- TODO add more info about the ingredients -->
  <v-expansion-panels v-model="panel" multiple>
    <v-expansion-panel v-for="(ingr, index) in data" :key="index">
      <v-expansion-panel-title disable-icon-rotate>
        <v-row class="align-center justify-start">
          <v-img
            v-if="ingr.photo"
            height="50"
            class="mr-2"
            lazy-src="https://placehold.co/3840x2160.png?text=Good+Food"
            max-width="50"
            :src="ingr.photo"
          />
          {{ ingr.name }}
        </v-row>
        <template v-slot:actions>
          <v-icon icon="mdi-pencil"> </v-icon>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-sheet width="300" class="mx-auto">
          <v-form>
            <UploadPhoto :photoURL="ingr.photo" @url="(photoURL) => (ingr.photo = photoURL)" />
            <v-text-field v-model="ingr.name" label="Product name"></v-text-field>
            <v-text-field v-model="ingr.price" label="Product price"></v-text-field>
            <v-select
              :items="unitNames"
              label="Measure Unit"
              @update:model-value="(value) => (ingr.measureUnit = value)"
            ></v-select>
            <v-btn
              @click="
                () => {
                  closePanel(index)
                  updateProduct(ingr.id, ingr)
                }
              "
              >Done</v-btn
            >
            <v-btn
              variant="text"
              icon="mdi-delete"
              @click="
                () => {
                  closePanel(index)
                  deleteIngredient(ingr.id)
                }
              "
            ></v-btn>
          </v-form>
        </v-sheet>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-sheet width="300" class="mx-auto">
    <v-form v-if="addWindow">
      <UploadPhoto :photoURL="photo" @url="(photoURL) => (photo = photoURL)" />

      <v-text-field v-model="name" label="Product name"></v-text-field>
      <v-text-field v-model="price" label="Product price"></v-text-field>
      <v-select
        :items="unitNames"
        label="Measure Unit"
        @update:model-value="(value) => (measureUnit = value)"
      ></v-select>
      <v-btn @click="addProduct">Done</v-btn>
    </v-form>
    <v-btn class="my-4" @click="() => (addWindow = !addWindow)">{{
      addWindow ? 'Cancel' : 'Add a product'
    }}</v-btn>
  </v-sheet>
</template>
<script setup>
import { ref } from 'vue'
defineProps(['data'])
import { useIngredientsStore } from '@store/ingredients'
import { deepUnref } from 'vue-deepunref'
import UploadPhoto from '@components/UploadPhoto.vue'

const store = useIngredientsStore()
const { addIngredient, updateIngredient, deleteIngredient } = store
const unitNames = ref(['gr', 'kg', 'piece', 'box', 'l', 'ml', 'tbsp', 'tsp', 'spice'])

const panel = ref(false)
const addWindow = ref(false)
const name = ref('')
const price = ref(0)
const measureUnit = ref('')
const photo = ref('')

const addProduct = async () => {
  const data = { name, price, available: false, photo, measureUnit }
  await addIngredient(deepUnref(data))
  resetForm()
}

const resetForm = () => {
  addWindow.value = false
  name.value = ''
  price.value = 0
  measureUnit.value = ''
  photo.value = []
}

const updateProduct = async (ingrId, ingr) => {
  await updateIngredient(ingrId, deepUnref(ingr))
}

const closePanel = (index) => {
  panel.value.splice(
    panel.value.findIndex((i) => i == index),
    1,
  )
}
</script>
