<template>
  <div>
    <div v-if="user">
      <h2>Welcome, {{ user.email }}</h2>
      <button @click="logOut">Sign Out</button>
    </div>
    <div v-else>
      <h2>Log In / Sign Up</h2>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="signIn">Log In</button>
      <button @click="signUp">Sign Up</button>
    </div>

    <v-btn append-icon="mdi-pencil-outline" size="small" v-id="user">
      <RouterLink to="/">Yummy dishes</RouterLink>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(null)
const user = ref(null)

const auth = getAuth()

const signIn = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log('succesfully logged in: ', data)
      router.push({ path: '/' })
    })
    .catch((err) => {
      error.value = err.message
    })
}

const signUp = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value).catch((err) => {
    error.value = err.message
  })
}

const handleAuthStateChanged = (firebaseUser) => {
  user.value = firebaseUser
}

const logOut = () => {
  signOut(auth).catch((err) => {
    error.value = err.message
  })
}

// Watch for changes in authentication state
onMounted(() => {
  const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged)
  // To unsubscribe from the watcher when the component unmounts
  onBeforeUnmount(unsubscribe)
})
</script>
