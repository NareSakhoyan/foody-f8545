import { defineStore } from 'pinia'
import {
  query,
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  addDoc,
  setDoc,
} from 'firebase/firestore'
import { db } from '@src/firebase.js'
import { useSnackbarStore } from './app'

export const useIngredientsStore = defineStore('ingredients', {
  state: () => ({
    allIngredients: [],
    currentIngredient: {},
  }),
  actions: {
    async setup() {
      let baseQuery = query(collection(db, 'ingredients'))
      onSnapshot(
        query(baseQuery),
        (querySnapshot) => {
          const arr = []
          querySnapshot.forEach((item) => {
            const details = item.data()
            arr.push({ id: item.id, ...details })
          })
          this.allIngredients = arr
        },
        (error) => {
          useSnackbarStore().setMessage(error.message, 'error')
        },
      )
    },
    async getIngredient(id) {
      try {
        const result = await getDoc(doc(db, 'ingredients', id))
        const data = result.data()
        data.id ??= id
        this.currentIngredient = data
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
    async addIngredient(data) {
      delete data.id
      try {
        await addDoc(collection(db, 'ingredients'), data)
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
    async deleteIngredient(id) {
      try {
        await deleteDoc(doc(db, 'ingredients', id))
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
    async updateIngredient(id, data) {
      try {
        await setDoc(doc(db, 'ingredients', id), data)
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
    async updateIngredientField(id, data) {
      try {
        await setDoc(doc(db, 'ingredients', id), data, { merge: true })
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
  },
})
