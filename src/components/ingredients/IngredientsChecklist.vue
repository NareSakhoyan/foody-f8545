<template>
  <v-list v-for="(ingr, i) in data" :key="`${i}-${ingr.name}`">
    <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>

    <v-list-item @click="ingr.available = !ingr.available">
      <template #prepend>
        <v-checkbox-btn v-model="ingr.available" color="grey"></v-checkbox-btn>
      </template>

      <v-list-item-title>
        <span :class="ingr.available ? 'text-grey' : 'text-primary'">{{ ingr.name }}</span>
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
  </v-list>
</template>

<script setup>
defineProps(['data'])
</script>
