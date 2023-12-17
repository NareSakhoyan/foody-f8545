import { defineStore } from 'pinia'

import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@src/firebase.js'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: true,
  }),
  actions: {
    setup() {},
    setLoading(value) {
      this.loading = value
    },
  },
})

export const useSnackbarStore = defineStore('snackbar', {
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

export const useAuthStore = defineStore('auth', () => {
  const appStore = useAppStore()
  const user = ref(null)
  const currentUser = computed(() => user)
  const setup = async () => {
    const result = await auth.onAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser) appStore.setLoading(false)
    })
    return result
  }
  const login = async (email, password) => await signInWithEmailAndPassword(auth, email, password)
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
