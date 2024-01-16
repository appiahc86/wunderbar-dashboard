import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import './style.css';
import router from "./router/index.js";
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import VueApexCharts from "vue3-apexcharts";


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);


// import 'primevue/resources/themes/rhea/theme.css';
import 'primevue/resources/themes/saga-purple/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
app.use(PrimeVue);
app.use(VueApexCharts);
app.use(ToastService);
app.use(router);
app.use(pinia);
app.mount('#app');
