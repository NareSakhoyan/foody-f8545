import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
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
  getDocs,
  and,
  limit,
} from 'firebase/firestore'
import {
  getStorage,
  ref as firebaseRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { db } from '@src/firebase.js'
import { auth } from '@src/firebase.js'
import { index } from '@src/query'

const storage = getStorage()

export const useSnackBar = defineStore('snackbar', {
  state: () => ({
    text: '',
    type: '',
    status: false,
    loading: false,
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
        setSnackBarMessage(error.message, 'error')
      }
    },
    async addDish(data) {
      delete data.id
      try {
        await addDoc(collection(db, 'dishes'), data)
      } catch (error) {
        setSnackBarMessage(error.message, 'error')
      }
    },
    async deleteDish(id) {
      try {
        await deleteDoc(doc(db, 'dishes', id))
      } catch (error) {
        setSnackBarMessage(error.message, 'error')
      }
    },
    async updateDish(id, data) {
      try {
        await setDoc(doc(db, 'dishes', id), data)
      } catch (error) {
        setSnackBarMessage(error.message, 'error')
      }
    },
    async updateDishField(id, data) {
      try {
        await setDoc(doc(db, 'dishes', id), data, { merge: true })
      } catch (error) {
        setSnackBarMessage(error.message, 'error')
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
        setSnackBarMessage(error.message, 'error')
      }
    },
  },
})

export const useAuthStore = defineStore('auth', () => {
  const snackBarStore = useSnackBar()
  const user = ref(null)
  const currentUser = computed(() => user)
  const setup = async () => {
    const result = await auth.onAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser) snackBarStore.loading = !snackBarStore.loading
    })
    return result
  }
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }
  const signUp = async (name, email, password) => {
    await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(auth.currentUser, {
      displayName: name,
    })
  }
  const logOut = async () => {
    await signOut(auth)
  }
  return {
    setup,
    login,
    signUp,
    logOut,
    user,
    currentUser,
  }
})

export const useCalendarStore = defineStore('calendar', () => {
  const authStore = useAuthStore()
  const currentWeek = ref([])
  const currentWeekStart = ref(null)
  const calendar = ref([])
  const { user } = storeToRefs(authStore)

  const setup = async () => {
    try {
      // find the first day of this week
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const currentDay = today.getDay()
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - currentDay + 1)

      currentWeekStart.value = startDate

      const q = query(
        collection(db, 'calendar'),
        and(
          where('key', '==', (startDate / 1000) | 0),
          where('user', '==', user.value.uid)
        )
      )
      const querySnapshot = await getDocs(q, limit(1))
      querySnapshot.forEach((doc) => {
        currentWeek.value = { id: doc.id, ...doc.data() }
      })
      if (!currentWeek?.value) {
        const generateCurrentWeek = () => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const currentDay = today.getDay()
          const startDate = new Date(today)
          startDate.setDate(today.getDate() - currentDay + 1) // Start from Monday

          const weekDates = []

          for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate)
            currentDate.setDate(startDate.getDate() + i)
            weekDates.push(currentDate)
          }
          return weekDates
        }

        currentWeek.value = generateCurrentWeek()
      }
    } catch (error) {
      const snackbar = useSnackBar()
      snackbar.setMessage(error.message, 'error')
    }
  }
  const addWeek = async (cards) => {
    if (currentWeek?.value?.id) {
      try {
        await setDoc(
          doc(db, 'calendar', currentWeek.value.id),
          { cards },
          {
            merge: true,
          }
        )
      } catch (error) {
        setSnackBarMessage(error.message, 'error')
      }
    } else {
      try {
        await addDoc(collection(db, 'calendar'), {
          key: (currentWeekStart.value / 1000) | 0,
          cards,
          user: user.value.uid,
        })
      } catch (error) {
        setSnackBarMessage(error.message, 'error')
      }
    }
  }

  return { currentWeek, calendar, setup, addWeek }
})
