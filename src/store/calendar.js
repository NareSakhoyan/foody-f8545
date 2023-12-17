import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import {
  query,
  where,
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  and,
  limit,
} from 'firebase/firestore'
import { db } from '@src/firebase.js'
import { useSnackbarStore, useAuthStore } from './app'

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
        and(where('key', '==', (startDate / 1000) | 0), where('user', '==', user.value.uid)),
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
      useSnackbarStore().setMessage(error.message, 'error')
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
          },
        )
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    } else {
      try {
        await addDoc(collection(db, 'calendar'), {
          key: (currentWeekStart.value / 1000) | 0,
          cards,
          user: user.value.uid,
        })
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    }
  }

  return {
    currentWeek,
    calendar,
    setup,
    addWeek,
  }
})
