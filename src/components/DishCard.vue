<template>
  <v-card>
    <v-img
      class="align-end text-white"
      height="200"
      :src="props.details.photo || 'https://placehold.co/3840x2160.png?text=Good+Food'"
      cover
    >
      <v-btn
        class="favorite"
        :icon="props.details.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
        @click="
          () =>
            updateDishField(props.details.id, {
              isFavorite: !props.details.isFavorite,
            })
        "
      ></v-btn>
      <v-card-title class="title">{{ props.details.name }}</v-card-title>
    </v-img>

    <v-card-text class="pt-2 pb-0">
      {{ props.details.ingredients?.map(({ title }) => title).join(', ') }}
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

    <v-expand-transition v-if="props.details.process">
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ props.details.process }}
        </v-card-text>
      </div>
    </v-expand-transition>
    <v-card-actions>
      <v-btn size="small" :to="`/dish/${props.details.id}`"> More </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="props.details.process"
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'
import { useDishStore } from '@store/dish'

const { updateDishField } = useDishStore()

const props = defineProps(['details'])
const show = ref(false)
</script>
<style>
.favorite {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.5rem;
  z-index: 1;
}
.title {
  background-color: #0006;
}
</style>
