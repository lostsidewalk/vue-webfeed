import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'

import i18n from './i18n'

createApp(App)
  .use(createPinia())
  .use(VueDOMPurifyHTML)
  .use(i18n)
  .mount('#app')
