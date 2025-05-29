import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@wokwi/elements'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faPalette, faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTrash, faPalette, faRotate)
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";


const app = createApp(App)
app.component('fa-icon', FontAwesomeIcon)
app.use(Vue3ColorPicker)
app.mount('#app')
