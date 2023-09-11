<template>
  <v-container cols="8">
    <v-form>
      <v-file-input label="Photo" v-model="photo" prepend-icon="mdi-camera" />
      <v-text-field
        label="What's the name?"
        v-model="currentDish.name"
        placeholder="Yummy"
      />
      <v-text-field
        label="For how many people?"
        v-model="currentDish.portion"
        suffix="people"
      />
      <v-combobox
        v-model="currentDish.ingredients.value"
        v-model:search="searchIngredient"
        :hide-no-data="false"
        :items="items"
        hide-selected
        label="Ingredients"
        multiple
        small-chips
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
      <v-combobox
        v-model="currentDish.filters.value"
        v-model:search="searchfilter"
        :hide-no-data="false"
        :items="items"
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

import { ref, onMounted } from 'vue'
import {
  getStorage,
  ref as firebaseRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { deepUnref } from 'vue-deepunref'
import { useDishStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'

const storage = getStorage()
const auth = getAuth()

const user = auth.currentUser

const route = useRoute()
const router = useRouter()

const items = ref(['cucumber', 'chicken', 'potato'])

const store = useDishStore()
const { getDish, addDish, updateDish } = store
const { currentDish } = storeToRefs(store)

const searchIngredient = ref('')
const searchfilter = ref('')
const editPageId = route.params.dish
const photo = ref('')

onMounted(async () => {
  if (editPageId) {
    await getDish(route.params.dish)
  }
})
const saveDish = async () => {
  const downloadURL = photo?.value[0] ? await uploadPhoto(photo.value[0]) : ''
  currentDish.value.user = user.uid
  currentDish.value.photo = downloadURL
  if (editPageId) {
    await updateDish(editPageId, deepUnref(currentDish))
  } else {
    await addDish(deepUnref(currentDish))
  }
  store.$reset()
  router.push('/')
}

// todo: move this to store
const uploadPhoto = async (photo) => {
  const storageRef = firebaseRef(storage, `${photo.name}`)
  try {
    await uploadBytes(storageRef, photo)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error.message)
  }
}
</script>
