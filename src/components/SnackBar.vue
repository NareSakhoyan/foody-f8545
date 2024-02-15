<template>
  <div class="text-center">
    <v-snackbar v-model="status" timeout="2000" :color="type">
      {{ text }}

      <template #actions>
        <v-btn color="white" variant="text" @click="closeSnackBar"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script setup>
import { useSnackbarStore } from '@store/app'
import { storeToRefs } from 'pinia'

const store = useSnackbarStore()
const { text, type, status } = storeToRefs(store)
const { closeSnackBar } = store
</script>
