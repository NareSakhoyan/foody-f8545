<template>
  <v-container>
    <h5 class="text-h5 ps-4 align-self-center">Home inventory</h5>
    <template v-for="(task, i) in tasks" :key="`${i}-${task.text}`">
      <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>

      <v-list-item @click="task.done = !task.done">
        <template #prepend>
          <v-checkbox-btn v-model="task.done" color="grey"></v-checkbox-btn>
        </template>

        <v-list-item-title>
          <span :class="task.done ? 'text-grey' : 'text-primary'">{{ task.text }}</span>
        </v-list-item-title>

        <template #append>
          <v-expand-x-transition>
            <v-list-subheader>General</v-list-subheader>

            <v-list-item value="notifications">
              <template #prepend="{ isActive }">
                <v-list-item-action start>
                  <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                </v-list-item-action>
              </template>

              <v-list-item-title>Notifications</v-list-item-title>

              <v-list-item-subtitle>
                Notify me abouhttps://app.pluralsight.com/idt updates to apps or games that I
                downloaded
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item value="sound">
              <template #prepend="{ isActive }">
                <v-list-item-action start>
                  <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                </v-list-item-action>
              </template>

              <v-list-item-title>Sound</v-list-item-title>

              <v-list-item-subtitle>
                Auto-update apps at any time. Data charges may apply
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item value="widgets">
              <template #prepend="{ isActive }">
                <v-list-item-action start>
                  <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                </v-list-item-action>
              </template>

              <v-list-item-title>Auto-add widgets</v-list-item-title>

              <v-list-item-subtitle>
                Automatically add home screen widgets when downloads complete
              </v-list-item-subtitle>
            </v-list-item>
          </v-expand-x-transition>
        </template>
      </v-list-item>
    </template>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const tasks = ref([])
</script>
