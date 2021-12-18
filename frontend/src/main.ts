import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = String(import.meta.env.VITE_BASE_API_URL)

createApp(App).mount('#app')
