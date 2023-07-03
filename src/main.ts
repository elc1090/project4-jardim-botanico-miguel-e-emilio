import './assets/main.scss'
import '@fortawesome/fontawesome-free/css/all.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases as aliasesFa, fa } from 'vuetify/iconsets/fa-svg'
import { aliases as aliasesMd, md } from 'vuetify/iconsets/md'
import { aliases as aliasesMdi, mdi } from 'vuetify/iconsets/mdi'
import { aliases as aliasesMdiSvg, mdi as mdiSvg } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

import App from '@/App.vue'
import router from './router'

const vuetify = createVuetify({
    ssr: true,
    icons: {
        defaultSet: 'fa',
        aliases: {
            ...aliasesFa,
            ...aliasesMd,
            ...aliasesMdi,
            ...aliasesMdiSvg,
        },
        sets: {
            fa,
            md,
            mdi,
            mdiSvg,
        },
    },
    components,
    directives,
})

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

library.add(fas)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
