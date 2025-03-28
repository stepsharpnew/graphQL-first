import { createApp, h } from 'vue';
import App from './App.vue';
import router from './router';
import apolloProvider from '../apolloProvider';

const app = createApp({
  render: () => h(App),
})

app.use(apolloProvider)

app.use(router);

app.mount('#app');
