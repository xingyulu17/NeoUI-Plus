import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'

library.add(fas)
import './style/index.css'
// console.log(App.render?.toString())
// component('font-awesome-icon', faUserSecret) 是全局注册  任何地方都可以使用了
createApp(App).mount('#app')
