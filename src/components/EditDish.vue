<template>
  <v-container cols="8">
    <v-form>
      <v-file-input label="Photo" v-model="photo" prepend-icon="mdi-camera" />
      <v-text-field label="What's the name?" v-model="name" placeholder="Yummy" />
      <v-text-field label="For how many people?" v-model="portion" suffix="people" />
      <v-combobox
        v-model="ingredients"
        v-model:search="search"
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
              <strong>{{ search }}</strong> Press <kbd>enter</kbd> to create a new one
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-combobox>
      <v-text-field label="How much time is it gonna take?" v-model="time" />
      <v-text-field label="How much does it cost?" v-model="cost" prefix="֏" />
      <v-textarea label="Notes?" v-model="process"></v-textarea>
      <v-row>
        <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="saveDish">
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

import { db } from '@/firebase.js'
import { ref, onMounted } from 'vue'
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { getStorage, ref as firebaseRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { deepUnref } from 'vue-deepunref'

import { useRoute, useRouter } from 'vue-router'

import { getAuth } from 'firebase/auth'

const storage = getStorage()
const auth = getAuth()

const user = auth.currentUser

console.log('USer: ', user, user?.uid)

const route = useRoute()
const router = useRouter()

const items = ref(['cucumber', 'chicken', 'potato'])

const name = ref('')
const cost = ref(0)
const ingredients = ref([])
const search = ref('')
const process = ref('')
const time = ref('')
const portion = ref()
const editPageId = route.params.dish
const photo = ref('')

onMounted(async () => {
  if (editPageId) {
    try {
      const result = await getDoc(doc(db, 'dishes', route.params.dish))
      const data = result.data()

      name.value = data.name || ''
      cost.value = data.cost || ''
      ingredients.value = data.ingredients || []
      process.value = data.process || ''
      time.value = data.time || ''
      portion.value = data.portion || ''
    } catch (error) {
      console.log(error)
    }
  }
})
const saveDish = async () => {
  try {
    const downloadURL = photo?.value[0] ? await uploadPhoto(photo.value[0]) : ''

    const payload = {
      name: name.value,
      cost: cost.value,
      ingredients: deepUnref(ingredients),
      process: process.value,
      time: time.value,
      portion: portion.value,
      user: user.uid,
      photo: downloadURL
    }
    console.log('payload:', payload)
    if (editPageId) {
      await setDoc(doc(db, 'dishes', editPageId), payload)
    } else {
      const docRef = await addDoc(collection(db, 'dishes'), payload)
      console.log('Document written with ID: ', docRef.id)
    }
    router.push('/')
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

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

const resetValues = () => {
  name.value = ''
  cost.value = 0
  ingredients.value = []
  search.value = ''
  process.value = ''
  time.value = ''
  portion.value = 2
}
</script>
