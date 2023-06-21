import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './main.scss'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
    ssr: true,
    icons: {
        defaultSet: 'fa',
        aliases,
        sets: {
            fa,
            mdi,
        },
    },
    components,
    directives,
})

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
