import router from '@renderer/router/index'
import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import './style/reset.css'
import './style/base.scss'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)
app.use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            locale: 'zh-CN'
        }
    })
    .mount('#app')
