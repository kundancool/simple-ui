import { createApp } from 'vue'
import '@kundancool/simple-ui/dist/simple-ui.css'
import './codeTokens.css'
import './shared.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// Lift the boot splash once Vue has painted.
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        const boot = document.getElementById('s-boot')
        if (!boot) {
            return
        }
        boot.classList.add('done')
        setTimeout(() => boot.remove(), 350)
    })
})
