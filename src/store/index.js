import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  query,
  where,
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  addDoc,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/firebase.js'
import { auth } from '@/firebase.js'
import {
  getStorage,
  ref as firebaseRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'

const storage = getStorage()

export const useSnackBar = defineStore('snackbar', {
  state: () => ({
    text: '',
    type: '',
    status: false,
  }),
  actions: {
    setMessage(text, type) {
      this.text = text
      this.type = type
      this.status = true
    },
    closeSnackBar() {
      this.status = false
    },
  },
})

const setSnackBarMessage = (msg) => {
  const snackBarStore = useSnackBar()
  snackBarStore.setMessage(msg, 'error')
}

import { index } from '@/query'

export const useDishStore = defineStore('dish', {
  state: () => ({
    user: null,
    dishes: [],
    filters: [],
    allIngredients: [],
    currentDish: {
      id: null,
      name: null,
      cost: null,
      ingredients: [],
      filters: [],
      process: null,
      time: null,
      portion: null,
      photo: null,
      user: null,
      isFavorite: null,
    },
  }),
  getters: {
    currentUser: (state) => state.user,
  },
  actions: {
    async setup() {
      this.getDishes()
      // TODO find a better way to fetch all the ingredients
      const { hits } = await index.search('')
      const ingrs = hits.reduce(
        (acc, { ingredients }) => [...acc, ...ingredients],
        []
      )
      this.allIngredients = ingrs
        .map(({ title }) => title)
        .filter((item) => item)
    },
    getDishes(filters = {}) {
      const { quickFilters, ingredients = [], time, cost } = filters

      let baseQuery = query(collection(db, 'dishes'))

      if (quickFilters?.length) {
        baseQuery = query(
          baseQuery,
          where('filters', 'array-contains-any', quickFilters)
        )
      }

      if (cost?.length) {
        baseQuery = query(
          baseQuery,
          where('cost', '>=', cost[0]),
          where('cost', '<=', cost[1])
        )
      }

      onSnapshot(
        query(baseQuery),
        (querySnapshot) => {
          const arr = []
          querySnapshot.forEach((item) => {
            const details = item.data()
            if (time && details?.time > time) return
            if (
              ingredients?.length &&
              !details.ingredients
                ?.map(({ title }) => title)
                .some((ingr) => ingredients.includes(ingr))
            )
              return
            arr.push({ id: item.id, ...details })
          })
          this.dishes = arr
        },
        (error) => {
          setSnackBarMessage(error.message, 'error')
        }
      )
    },
    async getDish(id) {
      try {
        const result = await getDoc(doc(db, 'dishes', id))
        const data = result.data()
        data.ingredients ??= []
        data.filters ??= []
        data.id ??= id
        this.currentDish = data
      } catch (error) {
        const snackbar = useSnackBar()
        snackbar.setMessage(error.message, 'error')
      }
    },
    async addDish(data) {
      try {
        await addDoc(collection(db, 'dishes'), data)
      } catch (error) {
        const snackbar = useSnackBar()
        snackbar.setMessage(error.message, 'error')
      }
    },
    async deleteDish(id) {
      try {
        await deleteDoc(doc(db, 'dishes', id))
      } catch (error) {
        const snackbar = useSnackBar()
        snackbar.setMessage(error.message, 'error')
      }
    },
    async updateDish(id, data) {
      try {
        await setDoc(doc(db, 'dishes', id), data)
      } catch (error) {
        const snackbar = useSnackBar()
        snackbar.setMessage(error.message, 'error')
      }
    },
    async updateDishField(id, data) {
      try {
        await setDoc(doc(db, 'dishes', id), data, { merge: true })
      } catch (error) {
        const snackbar = useSnackBar()
        snackbar.setMessage(error.message, 'error')
      }
    },
    async uploadPhoto(photoToUpload) {
      if (!photoToUpload) return null
      const storageRef = firebaseRef(storage, `${photoToUpload.name}`)
      try {
        await uploadBytes(storageRef, photoToUpload)
        const downloadURL = await getDownloadURL(storageRef)
        return downloadURL
      } catch (error) {
        const snackbar = useSnackBar()
        snackbar.setMessage(error.message, 'error')
      }
    },
    filter() {
      // todo handle filters
      return this.dishes.map((item) => item)
    },
  },
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  getters: {
    currentUser: (state) => state.user,
  },
  actions: {
    async setup() {
      auth.onAuthStateChanged((firebaseUser) => (this.user = firebaseUser))
    },
    async login(email, password) {
      return await signInWithEmailAndPassword(auth, email, password)
    },
    async signUp(name, email, password) {
      await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(auth.currentUser, {
        displayName: name,
      })
    },
    async logOut() {
      await signOut(auth)
    },
  },
})
