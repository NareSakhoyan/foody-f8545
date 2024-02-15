import { defineStore } from 'pinia'
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
import { db } from '@src/firebase.js'
import { index } from '@src/query'
import { useSnackbarStore } from './app'

export const useDishStore = defineStore('dish', {
  state: () => ({
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
      const ingrs = hits.reduce((acc, { ingredients }) => [...acc, ...ingredients], [])
      this.allIngredients = ingrs.map(({ title }) => title).filter((item) => item)
    },
    getDishes(filters = {}) {
      const { quickFilters, ingredients = [], time, cost } = filters

      let baseQuery = query(collection(db, 'dishes'))

      if (quickFilters?.length) {
        baseQuery = query(baseQuery, where('filters', 'array-contains-any', quickFilters))
      }

      if (cost?.length) {
        baseQuery = query(baseQuery, where('cost', '>=', cost[0]), where('cost', '<=', cost[1]))
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
          useSnackbarStore().setMessage(error.message, 'error')
        },
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
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
    async addDish(data) {
      delete data.id
      try {
        await addDoc(collection(db, 'dishes'), data)
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
    async deleteDish(id) {
      try {
        await deleteDoc(doc(db, 'dishes', id))
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
    async updateDish(id, data) {
      try {
        await setDoc(doc(db, 'dishes', id), data)
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
    async updateDishField(id, data) {
      try {
        await setDoc(doc(db, 'dishes', id), data, { merge: true })
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    },
  },
})
