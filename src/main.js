import './assets/main.css'

import { createApp } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fa } from 'vuetify/iconsets/fa'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

import InstantSearch from 'vue-instantsearch/vue3/es'
import { firebaseApp } from './firebase'
import router from './router'
import App from './App.vue'
import { pinia } from '@store'
import { install as installModalPlugin } from './plugins/ModalPlugin'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#009688',
        },
      },
    },
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
})

const app = createApp(App)

app.use(pinia)
app.use(firebaseApp)
app.use(router)
app.use(vuetify)
app.use(InstantSearch)
app.use(installModalPlugin)

app.mount('#app')
