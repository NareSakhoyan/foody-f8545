// plugins/modal.js
import { ref } from 'vue'

const modalState = ref({
  loginPopup: false,
})

export const useModal = () => {
  return modalState
}

export const install = (app) => {
  app.config.globalProperties.$modal = modalState
}
