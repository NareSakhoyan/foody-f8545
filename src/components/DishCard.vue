<template>
  <v-card class="mx-auto" max-width="344">
    <div>
      <div class="text-overline mb-1">
        {{ props.details.time }}
        <v-icon size="large" color="green-darken-2" icon="mdi-clock-time-five"></v-icon>
        | {{ props.details.portion }}
        <v-icon size="large" color="blue-darken-2" icon="mdi-account-multiple"></v-icon>
        | {{ props.details.cost }}
        <v-icon size="large" color="purple-darken-2" icon="mdi-currency-usd"></v-icon>
      </div>
      <div class="text-h6 mb-1">
        {{ props.details.name }}
      </div>
      <div class="text-caption">
        <!-- {{ props.details.ingredients?.map(({ name }) => name).join(' ') }} -->
        {{ props.details.ingredients?.join(' ') }}
      </div>
    </div>

    <v-card-actions>
      <v-btn append-icon="mdi-pencil-outline" size="small">
        <RouterLink :to="`/dish/${props.details.id}`">Edit</RouterLink>
      </v-btn>
      <v-btn append-icon="mdi-delete" size="small" @click="() => deleteDish(props.details.id)">
        Delete
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        v-if="props.details.proces"
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>

    <v-expand-transition v-if="props.details.proces">
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
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { ref } from 'vue'
const props = defineProps(['details'])

const show = ref(false)

const deleteDish = async (id) => {
  await deleteDoc(doc(db, 'dishes', id))
}
</script>
