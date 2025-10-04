import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(Vant)
app.mount('#bazi-calculator-app')
