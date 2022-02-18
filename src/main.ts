import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/tailwind.css';
import mitt from 'mitt';

const emmitter = mitt();

const app = createApp(App);
app.config.globalProperties.emitter = emmitter;
app.use(router);
app.mount('#app');