<template>
  <v-container>
    <h5 class="text-h5 ps-4 align-self-center">Home inventory</h5>
    <template v-for="(task, i) in tasks" :key="`${i}-${task.text}`">
      <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>

      <v-list-item @click="task.done = !task.done">
        <template v-slot:prepend>
          <v-checkbox-btn v-model="task.done" color="grey"></v-checkbox-btn>
        </template>

        <v-list-item-title>
          <span :class="task.done ? 'text-grey' : 'text-primary'">{{
            task.text
          }}</span>
        </v-list-item-title>

        <template v-slot:append>
          <v-expand-x-transition>
            <v-icon v-if="task.done" color="success"> mdi-check </v-icon>
          </v-expand-x-transition>
        </template>
      </v-list-item>
    </template>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
const tasks = ref([
  {
    done: false,
    text: 'Foobar',
  },
  {
    done: false,
    text: 'Fizzbuzz',
  },
])
</script>
