<template>
  <v-img
    v-if="photo"
    class="mx-auto"
    height="300"
    lazy-src="https://placehold.co/3840x2160.png?text=Good+Food"
    max-width="500"
    :src="photoURL"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
      </div>
    </template>
  </v-img>
  <v-file-input v-model="photo" label="Photo" prepend-icon="mdi-camera" @change="photoInput" />
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@store/app'

defineProps(['photoURL'])
const emit = defineEmits(['url'])

const { uploadPhoto } = useAppStore()

const photo = ref([])

const photoInput = async () => {
  if (!photo?.value[0]) return null
  emit('url', await uploadPhoto(photo?.value[0]))
}
</script>
