<template>
  <v-card>
    <v-img
      class="align-end text-white"
      height="200"
      :src="
        props.details.photo ||
        'https://placehold.co/3840x2160.png?text=Good+Food'
      "
      cover
    >
      <v-card-title>{{ props.details.name }}</v-card-title>
    </v-img>

    <v-card-text class="py-0">
      <!-- {{ props.details.ingredients?.map(({ name }) => name).join(' ') }} -->
      {{ props.details.ingredients?.join(' ') }}
    </v-card-text>

    <div class="d-flex py-3 justify-space-between">
      <v-list-item density="compact" prepend-icon="mdi-account-multiple">
        <v-list-item-subtitle>{{ props.details.portion }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider vertical />
      <v-list-item density="compact" prepend-icon="mdi-clock-time-five">
        <v-list-item-subtitle>{{ props.details.time }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider vertical />
      <v-list-item density="compact" prepend-icon="mdi-currency-usd">
        <v-list-item-subtitle>{{ props.details.cost }}</v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-card-actions>
      <v-btn
        prepend-icon="mdi-pencil-outline"
        size="small"
        :to="`/dish/${props.details.id}`"
      >
        Edit
      </v-btn>
      <v-btn
        prepend-icon="mdi-delete"
        size="small"
        @click="() => deleteDish(props.details.id)"
      >
        Delete
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        v-if="props.details.proces"
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>

    <v-expand-transition v-if="props.details.process">
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ props.details.process }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'
import { useDishStore } from '@/store'

const props = defineProps(['details'])
const store = useDishStore()
const show = ref(false)
const { deleteDish } = store
</script>
