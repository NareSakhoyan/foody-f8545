import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { firebaseApp } from './firebase'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { fa } from 'vuetify/iconsets/fa'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'

import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa
    }
  }
})

const app = createApp(App)

app.use(firebaseApp)
app.use(router)
app.use(vuetify)

app.mount('#app')
