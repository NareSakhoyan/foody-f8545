<template>
  <v-btn v-if="user" append-icon="mdi-logout" @click="logOut"> Log out </v-btn>
  <v-dialog v-else v-model="loginOverlay" width="1024">
    <template v-slot:activator="{ props }">
      <v-btn append-icon="mdi-account-circle" v-bind="props"> Log in </v-btn>
    </template>
    <v-card
      class="mx-auto pa-12 pb-8 mb-12"
      elevation="8"
      width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-if="signup"
        v-model="name"
        density="compact"
        placeholder="Name"
        prepend-inner-icon="mdi-card-account-details"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        required
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password

        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?</a
        >
      </div>

      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        @click="() => (signup ? signUp() : signIn())"
      >
        {{ signup ? 'Sign up' : 'Log In' }}
      </v-btn>

      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        v-if="!signup"
        @click="() => (signup = true)"
      >
        Sign up now
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@store'
import { storeToRefs } from 'pinia'

const store = useAuthStore()
const { user } = storeToRefs(store)

const loginOverlay = ref(false)
const visible = ref(false)
const signup = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')

const signIn = async () => {
  try {
    await store.login(email.value, password.value)
    loginOverlay.value = false
  } catch (error) {
    console.log(error)
  }
}

const signUp = async () => {
  try {
    await store.signUp(name.value, email.value, password.value)
    loginOverlay.value = false
  } catch (error) {
    console.log(error)
  }
}

const logOut = async () => {
  try {
    await store.logOut()
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  const unsubscribe = await store.setup()
  onBeforeUnmount(unsubscribe)
})
</script>
