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
import { getStartDateOfThisWeek, generateCurrentWeek } from '@src/utils'

export const useCalendarStore = defineStore('calendar', () => {
  const authStore = useAuthStore()
  const currentWeek = ref([])
  const currentWeekId = ref()
  const currentWeekStart = ref(getStartDateOfThisWeek())
  const calendar = ref([])
  const { user } = storeToRefs(authStore)

  const setup = async () => {
    try {
      const q = query(
        collection(db, 'calendar'),
        and(
          where('key', '==', (currentWeekStart.value / 1000) | 0),
          where('user', '==', user.value.uid),
        ),
      )

      const querySnapshot = await getDocs(q, limit(1))
      querySnapshot.forEach((doc) => {
        currentWeek.value = { id: doc.id, ...doc.data() }
        currentWeekId.value = doc.id
      })

      if (!(currentWeek.value && Object.keys(currentWeek.value).length)) {
        currentWeek.value = generateCurrentWeek()
      }
    } catch (error) {
      useSnackbarStore().setMessage(error.message, 'error')
    }
  }
  const addWeek = async (cards) => {
    if (currentWeekId.value) {
      try {
        await setDoc(
          doc(db, 'calendar', currentWeekId.value),
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
        const docRef = await addDoc(collection(db, 'calendar'), {
          key: (currentWeekStart.value / 1000) | 0,
          cards,
          user: user.value.uid,
        })
        currentWeek.value = {
          key: (currentWeekStart.value / 1000) | 0,
          cards,
          user: user.value.uid,
        }
        currentWeekId.value = docRef.id
      } catch (error) {
        useSnackbarStore().setMessage(error.message, 'error')
      }
    }
  }

  return {
    currentWeek,
    currentWeekId,
    calendar,
    setup,
    addWeek,
  }
})
